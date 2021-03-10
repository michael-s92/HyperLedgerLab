package chaincode

import (
	"crypto/ecdsa"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"

	crypto "github.com/michael-s92/HyperLedgerLab/inventory/blockchain/src/contract/covid-passport/pkg/crypto"
)

func GenerateTestFacility(stub shim.ChaincodeStubInterface, id, privateKey string) error {
	privKey, err := crypto.UnmarshalPrivateKey(privateKey)
	if err != nil {
		return fmt.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: %s: %w", id, err)
	}
	publicKeyStr, err := crypto.MarshalPublicKey(&privKey.PublicKey)
	if err != nil {
		return fmt.Errorf("Error marshaling ECDSA public key for Test Facility: %s: %w", id, err)
	}
	if err := stub.PutState(id, []byte(publicKeyStr)); err != nil {
		return fmt.Errorf("Error persisting Test Facility %s on ledger: %w", id, err)
	}
	return nil
}

func GenerateDhp(dhpId, testFacilityId string, testFacilityPrivateKey *ecdsa.PrivateKey,
	patientDid, method string, result bool,
	date, expiryDate time.Time) (*Dhp, error) {

	testResult := TestResult{
		TestFacilityId: testFacilityId,
		Patient:        IdHash(crypto.Hash([]byte(patientDid))),
		Method:         TestType(method),
		Result:         result,
		Date:           date,
		ExpiryDate:     expiryDate,
	}
	testResultB, err := json.Marshal(&testResult)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling test result for patient %s at test facility %s: %w", patientDid, testFacilityId, err)
	}
	r, s, err := ecdsa.Sign(rand.Reader, testFacilityPrivateKey, crypto.Hash(testResultB))
	if err != nil {
		return nil, fmt.Errorf("Error generating test result signature for patient %s at test facility %s: %w", patientDid, testFacilityId, err)
	}

	return &Dhp{
		Id:   fmt.Sprintf("%s-%s-%s", testFacilityId, patientDid, dhpId),
		Data: testResult,
		Signature: crypto.Signature{
			R: r,
			S: s,
		},
	}, nil
}
