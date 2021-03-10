package main

import (
	"crypto/ecdsa"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func generateTestFacility(stub shim.ChaincodeStubInterface, id, privateKey string) error {
	privKey, err := unmarshalPrivateKey(privateKey)
	if err != nil {
		return fmt.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: %s: %w", id, err)
	}
	publicKeyStr, err := marshalPublicKey(&privKey.PublicKey)
	if err != nil {
		return fmt.Errorf("Error marshaling ECDSA public key for Test Facility: %s: %w", id, err)
	}
	if err := stub.PutState(id, []byte(publicKeyStr)); err != nil {
		return fmt.Errorf("Error persisting Test Facility %s on ledger: %w", id, err)
	}
	return nil
}

func generateDhp(dhpId, testFacilityId string, testFacilityPrivateKey *ecdsa.PrivateKey,
	patientDid, method string, result bool) (*Dhp, error) {

	testResult := TestResult{
		TestFacilityId: testFacilityId,
		Patient:        IdHash(hash([]byte(patientDid))),
		Method:         TestType(method),
		Result:         result,
		Date:           time.Date(2021, 3, 9, 0, 0, 0, 0, time.UTC),
		ExpiryDate:     time.Date(2021, 3, 11, 0, 0, 0, 0, time.UTC),
		// Date:           time.Now().AddDate(0, 0, -1).Truncate(24 * time.Hour),
		// ExpiryDate:     time.Now().AddDate(0, 0, 2).Truncate(24 * time.Hour),
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
