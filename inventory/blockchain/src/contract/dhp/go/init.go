package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func SetupTestData(stub shim.ChaincodeStubInterface) ([]*Dhp, error) {
	// Test Facility: TF-1-Theresienwiese
	tf1Id := "TF-1-Theresienwiese"
	tf1PrivateKey, err := generateTestFacility(tf1Id, stub)
	if err != nil {
		return nil, err
	}

	// Test Patient: Milan
	dhp1, err := generateDhp("001", tf1Id, tf1PrivateKey, "Milan", "PCR", true)
	if err != nil {
		return nil, err
	}

	return []*Dhp{dhp1}, nil
}

func generateTestFacility(id string, stub shim.ChaincodeStubInterface) (*ecdsa.PrivateKey, error) {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("Error generating ECDSA keypair for Test Facility: %s: %w", id, err)
	}
	publicKeyB, err := json.Marshal(&privateKey.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA public key for Test Facility: %s: %w", id, err)
	}
	if err := stub.PutState(id, publicKeyB); err != nil {
		return nil, fmt.Errorf("Error persisting Test Facility %s on ledger: %w", id, err)
	}
	return privateKey, nil
}

func generateDhp(dhpId, testFacilityId string, testFacilityPrivateKey *ecdsa.PrivateKey,
	patientDid, method string, result bool) (*Dhp, error) {

	testResult := TestResult{
		TestFacilityId: testFacilityId,
		Patient:        IdHash(hash([]byte(patientDid))),
		Method:         TestType(method),
		Result:         result,
		Date:           time.Now().AddDate(0, 0, -1),
		ExpiryDate:     time.Now().AddDate(0, 0, 2),
	}
	testResultB, err := json.Marshal(&testResult)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling test result for patient %s at test facility %s: %w", patientDid, testFacilityId, err)
	}
	r, s, err := ecdsa.Sign(rand.Reader, testFacilityPrivateKey, hash(testResultB))
	if err != nil {
		return nil, fmt.Errorf("Error generating test result signature for patient %s at test facility %s: %w", patientDid, testFacilityId, err)
	}

	return &Dhp{
		Id:   fmt.Sprintf("%s-%s-%s", testFacilityId, patientDid, dhpId),
		Data: testResult,
		Signature: Signature{
			R: r,
			S: s,
		},
	}, nil
}
