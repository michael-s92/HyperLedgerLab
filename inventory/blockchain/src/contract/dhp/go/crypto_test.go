package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"testing"
)

func TestGenerateTestFacilityKeys(t *testing.T) {
	varCodeBlock := `
	var (
	%s
	)
	`
	tfKeyLine := `	tfKey%d string = "%s"
	`

	var tfKeyCodeBlock string
	for i := 1; i <= 3; i++ {
		privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
		if err != nil {
			t.Errorf("Error generating ECDSA keypair: %s", err)
		}
		pkStr, err := marshalPrivateKey(privateKey)
		if err != nil {
			t.Error(err)
		}

		tfKeyCodeBlock += fmt.Sprintf(tfKeyLine, i, pkStr)
	}
	t.Logf(varCodeBlock, tfKeyCodeBlock)
}

func TestUnmarshalPregeneratedKeys(t *testing.T) {
	if _, err := unmarshalPrivateKey(tfKey1); err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: TF-1: %w", err)
	}
	if _, err := unmarshalPrivateKey(tfKey2); err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: TF-2: %w", err)
	}
	if _, err := unmarshalPrivateKey(tfKey3); err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: TF-3: %w", err)
	}
}

func TestECCMarshalBidirectional(t *testing.T) {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Error("Error generating ECDSA keypair")
	}

	pkBB, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		t.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	pkBJ, err := json.Marshal(&pkBB)
	if err != nil {
		t.Errorf("Error marshaling ECDSA binary to JSON: %s", err)
	}
	t.Log(string(pkBJ))

	var upkBB []byte
	if err := json.Unmarshal(pkBJ, &upkBB); err != nil {
		t.Errorf("Error unmarshaling JSON binary to ECDSA: %s", err)
	}

	upKi, err := x509.ParsePKCS8PrivateKey(upkBB)
	if err != nil {
		t.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	unmarshaledPrivateKey := *upKi.(*ecdsa.PrivateKey)

	if privateKey.Equal(unmarshaledPrivateKey) {
		t.Errorf("Unamarshaled private key does not equal original private key. \n Original Key: %#v \n Unmarshaled Key: %#v", privateKey, unmarshaledPrivateKey)
	}
}
