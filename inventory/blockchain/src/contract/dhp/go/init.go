package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var (
	tf1PrivateKeyStr string = `{"Curve":{"P":115792089210356248762697446949407573530086143415290314195533631308867097853951,"N":115792089210356248762697446949407573529996955224135760342422259061068512044369,"B":41058363725152142129326129780047268409114441015993725554835256314039467401291,"Gx":48439561293906451759052585252797914202762949526041747995844080717082404635286,"Gy":36134250956749795798585127919587881956611106672985015071877198253568414405109,"BitSize":256,"Name":"P-256"},"X":20064959939376339760577745711085495258234939845383701303301304674400762751202,"Y":29494603973481678237051076142292564758306448581156502669954190429968596708871,"D":76709830655480177335651486773001347798524516730229736178922511961647013663702}`
)

func SetupTestData(stub shim.ChaincodeStubInterface) ([]*Dhp, error) {
	// Test Facility: TF-1-Theresienwiese
	tf1Id := "TF-1-Theresienwiese"
	tf1PrivateKey, err := generateTestFacility(tf1Id, stub)
	if err != nil {
		return nil, err
	}

	// Test Patient: Milan
	dhp1, err := generateDhp("001", tf1Id, tf1PrivateKey, "Milan", "PCR", true)
	if err != nil {
		return nil, err
	}

	return []*Dhp{dhp1}, nil
}

func generateTestFacility(id string, stub shim.ChaincodeStubInterface) (*ecdsa.PrivateKey, error) {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("Error generating ECDSA keypair for Test Facility: %s: %w", id, err)
	}
	publicKeyB, err := json.Marshal(&privateKey.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA public key for Test Facility: %s: %w", id, err)
	}
	if err := stub.PutState(id, publicKeyB); err != nil {
		return nil, fmt.Errorf("Error persisting Test Facility %s on ledger: %w", id, err)
	}
	return privateKey, nil
}

func generateDhp(dhpId, testFacilityId string, testFacilityPrivateKey *ecdsa.PrivateKey,
	patientDid, method string, result bool) (*Dhp, error) {

	testResult := TestResult{
		TestFacilityId: testFacilityId,
		Patient:        IdHash(hash([]byte(patientDid))),
		Method:         TestType(method),
		Result:         result,
		Date:           time.Now().AddDate(0, 0, -1),
		ExpiryDate:     time.Now().AddDate(0, 0, 2),
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
