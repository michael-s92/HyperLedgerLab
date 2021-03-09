package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ===================================================================================
// Main
// ===================================================================================
func main() {
	err := shim.Start(new(CovidPassportChaincode))
	if err != nil {
		fmt.Printf("Error starting DHP chaincode: %s", err)
	}
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

	// Caliper Test Functions
	if function == "initLedger" {
		return c.InitLedger(stub)
	} else if function == "doNothing" {
		return c.DoNothing(stub)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ===================================================================================
// TEST CODE
// ===================================================================================
func smokeTest() {
	err := shim.Start(new(CovidPassportChaincode))
	if err != nil {
		fmt.Printf("Error starting DHP chaincode: %s", err)
	}
}
