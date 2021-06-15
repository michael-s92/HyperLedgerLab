package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func DhpCompositeKey(stub shim.ChaincodeStubInterface, patientDid, method string) (string, error) {
	return stub.CreateCompositeKey("patient~method", []string{patientDid, method})
}

func FetchDhpsFromLedger(stub shim.ChaincodeStubInterface, patientDid, method string) ([]Dhp, error) {
	var dhps []Dhp
	st, err := stub.GetStateByPartialCompositeKey("patient~method", []string{patientDid})
	if err != nil {
		return nil, fmt.Errorf("Error retrieving DHPs from ledger using partial composite key: %w", err)
	}
	defer st.Close()
	for st.HasNext() {
		kv, err := st.Next()
		if err != nil {
			return nil, fmt.Errorf("Error accessing DHP result set: %w", err)
		}
		var dhp Dhp
		if err := json.Unmarshal(kv.Value, &dhp); err != nil {
			return nil, fmt.Errorf("Error unmarshaling DHP: %w", err)
		}
		dhps = append(dhps, dhp)
	}
	return dhps, nil
}
