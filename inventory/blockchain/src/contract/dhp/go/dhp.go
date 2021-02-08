package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// Digital Health Passport Chaincode implementation
type DigitalHealthPassportChaincode struct {
}

//type marble struct {
//	ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
//	Name       string `json:"name"`    //the fieldtags are needed to keep case from bouncing around
//	Color      string `json:"color"`
//	Size       int    `json:"size"`
//	Owner      string `json:"owner"`
//}


// Init initializes chaincode
// ===========================
func (t *DigitalHealthPassportChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
// ========================================
func (t *DigitalHealthPassportChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "initLedger" { //create a new marble
		return t.initLedger(stub, args)
	} else if function == "doNothing" { //change owner of a specific marble
		return t.doNothing(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// initMarble - create a new marble, store into chaincode state
// ============================================================
func (t *DigitalHealthPassportChaincode) initLedger(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("initLedger")
	return shim.Success(nil)
}

func (t *DigitalHealthPassportChaincode) doNothing(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	fmt.Println("doNothing")
	return shim.Success(nil)
}

func main() {
	err := shim.Start(new(DigitalHealthPassportChaincode))
	if err != nil {
		fmt.Printf("Error starting DigitalHealthPassport chaincode: %s", err)
	}
}