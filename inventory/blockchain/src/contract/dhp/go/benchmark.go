package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var (
	tfKey1 string = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgtBf/GeoCI+FfjThz1EjS2L/OuvZN+RDh5OzbUoSyR2GhRANCAASAwWk9vZcswsuxdyH8QMBc1+ym5DW2DYQcw1pNuzj6DwZMqI1ClloIPJvpMHShCQPqBcOcb7+L7JgFToWCDIXU"
	tfKey2 string = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgmPKQMVfjuvVRsVCJadJYAGz4iYjePTUZP1/DggRatJ6hRANCAASW3I/UtT068Ca7yBprdIYbE3FFSeFP4b1oVP+yeVLUKthbJRtGx4PlflGBmcnrDgssui1GXpo43dFDXC9IDzyL"
	tfKey3 string = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg+UysfVrw+AByu3jVAt8gNq2lfpqv/dshFsVAzdsZbFqhRANCAAQB2ZhhVhEvvjyaaJgBIE4Xs2Cp4oqRs5Evv0Yh85UgkUpIgQQzpGRE+6bBjty4OaU+clMpZ+UVc5mL/zsKlMqZ"
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
	privateKey, err := unmarshalPrivateKey([]byte(tfKey1))
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
