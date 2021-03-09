package main

import (
	"crypto/ecdsa"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (c *CovidPassportChaincode) InitLedger(stub shim.ChaincodeStubInterface) pb.Response {
	_, err := SetupTestData(stub)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func (c *CovidPassportChaincode) DoNothing(stub shim.ChaincodeStubInterface) pb.Response {
	var tf1PrivateKey *ecdsa.PrivateKey
	if err := json.Unmarshal([]byte(tf1PrivateKeyStr), tf1PrivateKey); err != nil {
		return shim.Error(fmt.Sprintf("Error unmarshaling tf1PrivateKey: %s", err))
	}

	// Test Patient: Milan
	dhp1, err := generateDhp("001", "TF-1-Theresienwiese", tf1PrivateKey, "Milan", "PCR", true)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error generating dhp1: %s", err))
	}

	dhp1B, err := json.Marshal(&dhp1)
	if err != nil {
		return shim.Error(fmt.Sprintf("Error marshaling dhp1: %s", err))
	}

	return c.UploadDhp(stub, []string{string(dhp1B)})
}
