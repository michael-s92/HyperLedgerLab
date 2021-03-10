package main

import (
	"encoding/json"
	"testing"
)

func TestDhpSignVerify(t *testing.T) {
	// TF-1 key
	tf1PrivKey, err := unmarshalPrivateKey(tfKey1)
	if err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility TF-1: %s", err)
	}
	tf1PubKey := tf1PrivKey.PublicKey

	// Test Patient: Milan
	dhp1, err := generateDhp("001", "TF-1-Theresienwiese", tf1PrivKey, "Milan", "PCR", true)
	if err != nil {
		t.Errorf("Error generating dhp1: %s", err)
	}

	// DEBUG
	t.Logf("Date: %s", dhp1.Data.Date)
	t.Logf("ExpiryDate: %s", dhp1.Data.ExpiryDate)

	// Simulate PubKey Put/Set on channel
	tmp1, err := marshalPublicKey(&tf1PubKey)
	if err != nil {
		t.Errorf("Error marshaling public key: %s", err)
	}
	tmp2 := []byte(tmp1)
	tmp3 := string(tmp2)
	issCrt, err := unmarshalPublicKey(tmp3)
	if err != nil {
		t.Errorf("Error unmarshaling public key: %s", err)
	}

	// Validate signature
	data, err := json.Marshal(&dhp1.Data)
	if err != nil {
		t.Errorf("Error marshaling TestResult data inside DHP: %s", err)
	}
	if !validateSignature(data, dhp1.Signature, issCrt) {
		t.Errorf("Signature validation failed! \n Issuer: %s \n Signature: %#v \n TestResult: %#v", *issCrt, dhp1.Signature, data)
	}

}
