package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var (
	tfKey1 string = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgN33Tn1iVORYJKbMlyWK5erHetMRmbNqTbFiAzwE+vA6hRANCAASxhkksdofM3NoKHrZoFl79RMoh+tMjWIiu61mlBTvml5jcdP3X2XHxtYuCXmkjK7dT0fQw72kyojwm6vbd+clC"
	tfKey2 string = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgRDsFbT75TZ1mP7EIMGGfdt83VmoVyypPZVJkn9QJxWuhRANCAATwTCATI0CP2oMcA0u0swtzFDEmEQIUgd++CTF9JIBKNxqbe92g3X7saHK2puc+OSDKvVsO3TO6o5kNRZ0727o+"
	tfKey3 string = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg0AQREEYO75R0Dmtp1/DPa3nFWSTk/7QWpLjefY46SR6hRANCAAQTq7kswYZ6q+A6J1rw42YRGC+WACZvoQq9CnuWP3pMA58bcXsLi0eB3BwEdwtTV9zKD6qgCrxM99Qd0qBkNecA"
)

func (c *CovidPassportChaincode) InitLedger(stub shim.ChaincodeStubInterface) pb.Response {
	if err := generateTestFacility(stub, "TF-1-Theresienwiese", tfKey1); err != nil {
		return shim.Error(err.Error())
	}
	if err := generateTestFacility(stub, "TF-2-Sonnenstraße", tfKey1); err != nil {
		return shim.Error(err.Error())
	}
	if err := generateTestFacility(stub, "TF-3-DeutschesMuseum", tfKey1); err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (c *CovidPassportChaincode) DoNothing(stub shim.ChaincodeStubInterface) pb.Response {
	privateKey, err := unmarshalPrivateKey(tfKey1)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error unmarshaling pregenerated ECDSA keypair for Test Facility TF-1: %s", err))
	}

	// Test Patient: Milan
	dhp1, err := generateDhp("001", "TF-1-Theresienwiese", privateKey, "Milan", "PCR", true)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error generating dhp1: %s", err))
	}

	dhp1B, err := json.Marshal(&dhp1)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error marshaling dhp1: %s", err))
	}

	return c.UploadDhp(stub, []string{string(dhp1B)})
}
