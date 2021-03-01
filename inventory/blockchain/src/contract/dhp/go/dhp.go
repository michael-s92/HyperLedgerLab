package main

import (
	"fmt"
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// Digital Health Passport Chaincode implementation
type DigitalHealthPassportChaincode struct {
}

// ===========================
// Data to store
// ===========================

type holder struct {
	ObjectType string `json:"docType"`
	Id         string `json:"id"`    
	PublicKey  string `json:"publicKey"`
	TravelDoc  string `json:"travelDoc"`
}
/*
type issuer struct {
	ObjectType string `json:"docType"`
	Id         string `json:"id"`
	PublicKey  string `json:"publicKey"`
}

type digitalHealthPassport struct {
	ObjectType   string   `json:"docType"`
	HolderId     string   `json:"holderId"` 
	IssuerId     string   `json:"issuerId"`
	Timestamp    string   `json:"timestamp"`
	Test         string   `json:"testingMethod"`
	Signature    string   `json:"signature"`
	AccessRights []string `json:"accessRights"`
}
*/
// ===========================
// Init initializes chaincode
// ===========================
func (t *DigitalHealthPassportChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// ========================================
// Invoke - Our entry point for Invocations
// ========================================
func (t *DigitalHealthPassportChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "initLedger" {
		return t.initLedger(stub, args)
	} else if function == "doNothing" {
		return t.doNothing(stub, args)
	} else if function == "registerHolder" {
		return t.registerHolder(stub, args)
	} else if function == "issueDigitalHealthPassport" {
		return t.issueDigitalHealthPassport(stub, args)
	} else if function == "verifyDigitalHealthPassport" {
		return t.verifyDigitalHealthPassport(stub, args)
	} else if function == "grandReadRight" {
		return t.grandReadRight(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// Transactions
// ============================================================
func (t *DigitalHealthPassportChaincode) initLedger(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("initLedger")
	return shim.Success(nil)
}

func (t *DigitalHealthPassportChaincode) doNothing(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("doNothing")
	return shim.Success(nil)
}

// Args: holderId, publicKey, travelDoc
func (t *DigitalHealthPassportChaincode) registerHolder(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("registerHolder")

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3nd argument must be a non-empty string")
	}

	holderId := args[0]
	holderPublicKey := args[1]
	travelDoc := args[2]

	// check if holder already exist
	holderAsBytes, err := stub.GetState(holderId)
	if err != nil {
		return shim.Error("Failed to get holder: " + err.Error())
	} else if holderAsBytes != nil {
		fmt.Println("This holder already exists: " + holderId)
		return shim.Error("This holder already exists: " + holderId)
	}

	// create holder object and marshal to json
	objectType := "holder"
	holder := &holder{objectType, holderId, holderPublicKey, travelDoc}

	holderJsonBytes, err := json.Marshal(holder)
	if err != nil {
		return shim.Error(err.Error())
	}

	// save holder to state
	err = stub.PutState(holderId, holderJsonBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	
	return shim.Success(nil)
}

func (t *DigitalHealthPassportChaincode) issueDigitalHealthPassport(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("issueDigitalHealthPassport")
	return shim.Success(nil)
}

func (t *DigitalHealthPassportChaincode) verifyDigitalHealthPassport(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("verifyDigitalHealthPassport")
	return shim.Success(nil)
}

func (t *DigitalHealthPassportChaincode) grandReadRight(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("grandReadRight")
	return shim.Success(nil)
}

// =================================
// Main
// =================================
func main() {
	err := shim.Start(new(DigitalHealthPassportChaincode))
	if err != nil {
		fmt.Printf("Error starting DigitalHealthPassport chaincode: %s", err)
	}
}