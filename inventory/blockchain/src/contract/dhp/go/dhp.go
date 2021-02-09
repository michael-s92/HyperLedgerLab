package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// Digital Health Passport Chaincode implementation
type DigitalHealthPassportChaincode struct {
}

// ===========================
// Data to store
// ===========================

//type marble struct {
//	ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
//	Name       string `json:"name"`    //the fieldtags are needed to keep case from bouncing around
//	Color      string `json:"color"`
//	Size       int    `json:"size"`
//	Owner      string `json:"owner"`
//}

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
	} else if function == "registerUser" {
		return t.registerUser(stub, args)
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

func (t *DigitalHealthPassportChaincode) registerUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("registerUser")
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