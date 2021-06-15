package main

import (
	"encoding/json"
	"testing"
	"time"
)

func Test_LoadSeeds(t *testing.T) {
	if err := loadSeeds(); err != nil {
		t.Fatal(err)
	}

	if len(seeds.TestFacilities) < 1 {
		t.Fatalf("No test facilities loaded from seeds: %#v", *seeds)
	}

	if len(seeds.ValidDhps) < 1 {
		t.Fatalf("No dhps loaded from seeds: %#v", *seeds)
	}
}

func Test_DhpSignVerify(t *testing.T) {
	// TF-1 key
	tf1PrivKey, err := UnmarshalPrivateKey("MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgrlPDKGaYXHWBGb/3LTuFQ7CCGDlMs0xHr2HgSTN5oe2hRANCAASB1g28k97xrCbwktz8aBMQ05B2U8Lrmp3m9J10EuAroqjibFNlDqG7XX4hPodjRw76MP15p/z3emKoydNnbKL6")
	if err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility TF-1: %s", err)
	}
	tf1PubKey := tf1PrivKey.PublicKey

	// Test Patient: Milan
	dhp1, err := generateDhp("001", "TF-1-Theresienwiese", tf1PrivKey, "Milan", "PCR", true, time.Time{}, time.Time{})
	if err != nil {
		t.Errorf("Error generating dhp1: %s", err)
	}

	// DEBUG
	t.Logf("Date: %s", dhp1.Data.Date)
	t.Logf("ExpiryDate: %s", dhp1.Data.ExpiryDate)

	// Simulate PubKey Put/Set on channel
	tmp1, err := MarshalPublicKey(&tf1PubKey)
	if err != nil {
		t.Errorf("Error marshaling public key: %s", err)
	}
	tmp2 := []byte(tmp1)
	tmp3 := string(tmp2)
	issCrt, err := UnmarshalPublicKey(tmp3)
	if err != nil {
		t.Errorf("Error unmarshaling public key: %s", err)
	}

	// Validate signature
	data, err := json.Marshal(&dhp1.Data)
	if err != nil {
		t.Errorf("Error marshaling TestResult data inside DHP: %s", err)
	}
	if !ValidateSignature(data, dhp1.Signature, issCrt) {
		t.Errorf("Signature validation failed! \n Issuer: %s \n Signature: %#v \n TestResult: %#v", *issCrt, dhp1.Signature, data)
	}

	// DEBUG
	t.Logf("Issuer: %s \n Signature: %#v \n TestResult: %#v", *issCrt, dhp1.Signature, data)

}
