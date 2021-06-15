package main

import (
	"crypto/ecdsa"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type CovidPassportChaincode struct {
}

// IdHash represents a deterministic cryptographic hash of a valid and verified patient ID Document
// (e.g. Foto of Passport). The hash algorithm is flexible, as long as as both patient and test facility
// application both support it.
// Verification of the hash are done off-chain due to performance limitations.
type IdHash []byte

func (i *IdHash) String() string { return hex.EncodeToString(*i) }

// IssuerCert is the ECDSA public key of an approved test facility
type IssuerCert *ecdsa.PublicKey

// TestType reflects the test method employed by the test facility
// It can be any string understood by all involved parties.
// On verification, consumers can include a list of accepted TestTypes.
type TestType string

// TestResult is a container object aggregating information for a single test outcome
type TestResult struct {
	TestFacilityId string    `json:"testFacilityId"`       // Id of the issuing test facility (allows for pinning and efficient retrieval of ECDSA pubkey)
	Patient        IdHash    `json:"patient"`              // Hash of the patient's identity document
	Method         TestType  `json:"method"`               // The testing method that generated the result, e.g. PCR, Antibody, etc.
	Result         bool      `json:"result"`               // The outcome of the test. 0 := negative, 1 := positive. In case of Antibody test 0 := no immunity, 1 := immunity
	Date           time.Time `json:"date"`                 // The date when the test was taken
	ExpiryDate     time.Time `json:"expiryDate,omitempty"` // The date when the test result is deemed to lose its value. Depends on the test method.
}

// Dhp is a Digital Health Passport consisting of
// a verified test result and the corresponding signature from the test facility
type Dhp struct {
	Id        string     `json:"id"`        // Unique identifier per DHP
	Data      TestResult `json:"data"`      // The container for the actual test result
	Signature Signature  `json:"signature"` // Signature of the test result container signed by the test facility
}

// Init initializes chaincode
// ===========================
func (c *CovidPassportChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke - Entry point for Invocations
// ========================================
func (c *CovidPassportChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Chaincode Functions
	if function == "UploadDhp" { // Validate and store signed DHP from test facility
		return c.UploadDhp(stub, args)
	} else if function == "VerifyResult" { // Verify test result for a specific patient
		return c.VerifyResult(stub, args)
	} else if function == "PurgeExpiredDhps" { // delete all expired DHPs (GDPR compliance)
		return c.PurgeExpiredDhps(stub, args)
	}

	// HyperledgerLab Test Functions
	if function == "initLedger" {
		return c.InitLedger(stub)
	} else if function == "doNothing" {
		return c.DoNothing(stub)
	} else if function == "benchmarkUploadDhpValid" {
		return c.BenchmarkUploadDhpValid(stub, args)
	} else if function == "benchmarkVerifyResult" {
		return c.BenchmarkVerifyResult(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// PurgeExpiredDhps deletes all expired DHPs (GDPR compliance)
func (c *CovidPassportChaincode) PurgeExpiredDhps(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Input Validation
	if len(args) != 0 {
		return shim.Error("Incorrect number of arguments. Expecting 0")
	}

	wstate, err := stub.GetStateByRange("", "")
	if err != nil {
		return shim.Error(fmt.Sprintf("Error retrieving chaincode world state: %s", err))
	}
	defer wstate.Close()
	now := time.Now()
	for wstate.HasNext() {
		kv, err := wstate.Next()
		if err != nil {
			return shim.Error(fmt.Sprintf("Error accessing chaincode world state: %s", err))
		}

		var dhp Dhp
		// Skip if not a DHP
		if err := json.Unmarshal(kv.Value, &dhp); err != nil {
			continue
		}

		// Delete if expired
		if now.After(dhp.Data.ExpiryDate) {
			dhpCompKey, err := DhpCompositeKey(stub, string(dhp.Data.Patient), string(dhp.Data.Method))
			if err != nil {
				return shim.Error(fmt.Sprintf("Error determining composite key for DHP: %s", err))
			}
			if err := stub.DelState(dhpCompKey); err != nil {
				return shim.Error(fmt.Sprintf("Error deleting expired DHP: %s", err))
			}
		}
	}

	return shim.Success(nil)
}

// UploadDhp is called by test facilities to upload a pre-created and signed DHP.
// Expects one argument, a string of a JSON encoded DHP
func (c *CovidPassportChaincode) UploadDhp(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Input Validation
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var dhp Dhp
	err := json.Unmarshal([]byte(args[0]), &dhp)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error unmarshaling DHP (expected valid JSON): %s", err))
	}

	// Retrieve issuer cert
	issCrtB, err := stub.GetState(dhp.Data.TestFacilityId)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error reading issuer certificate for TestFacilityId %s from ledger: %s", dhp.Data.TestFacilityId, err))
	}
	if issCrtB == nil {
		return shim.Error(fmt.Sprintf("Issuer certificate for TestFacilityId %s is nil", dhp.Data.TestFacilityId))
	}
	issuerCert, err := UnmarshalPublicKey(string(issCrtB))
	if err != nil {
		return shim.Error(fmt.Sprintf("Error unmarshaling IssuerCert: %s", err))
	}

	// Validate signature
	data, err := json.Marshal(&dhp.Data)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error marshaling TestResult data inside DHP: %s", err))
	}
	if !ValidateSignature(data, dhp.Signature, issuerCert) {
		return shim.Error(fmt.Sprintf("Signature validation failed! \n Issuer: %#v \n Signature: %#v \n TestResult: %#v \n\n Date: %s \n ExpiryDate: %s", *issuerCert, dhp.Signature, data, dhp.Data.Date, dhp.Data.ExpiryDate))
	}

	// Store DHP on ledger with composite key
	storeDhp, err := json.Marshal(&dhp)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error marshaling DHP: %s", err))
	}
	dhpCompKey, err := DhpCompositeKey(stub, string(dhp.Data.Patient), string(dhp.Data.Method))
	if err != nil {
		return shim.Error(fmt.Sprintf("Error determining composite key for DHP: %s", err))
	}
	if err := stub.PutState(dhpCompKey, storeDhp); err != nil {
		return shim.Error(fmt.Sprintf("Error storing DHP: %s", err))
	}

	return shim.Success(nil)
}

// Verify the most recent (valid / not expired) result for a given patient and test method
// Expects 2 arguments: IdHash (of patient) and AcceptedTestType (* for any)
func (c *CovidPassportChaincode) VerifyResult(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Input Validation
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	patient := args[0]
	method := args[1]

	// Fetch DHPs
	dhps, err := FetchDhpsFromLedger(stub, patient, method)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error retrieving DHP from ledger: %s", err))
	}

	// Extract test results from not expired DHPs
	var trs []TestResult
	now := time.Now()
	for _, dhp := range dhps {
		if now.After(dhp.Data.ExpiryDate) {
			continue
		}

		trs = append(trs, dhp.Data)
	}

	// Construct chaincode payload and return results
	payload, err := json.Marshal(struct {
		Results []TestResult `json:"results"`
	}{
		Results: trs,
	})
	if err != nil {
		return shim.Error(fmt.Sprintf("Error constructing response payload: %s", err))
	}
	return shim.Success(payload)
}
