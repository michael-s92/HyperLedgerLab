package chaincode

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	ccrypto "github.com/michael-s92/HyperLedgerLab/inventory/blockchain/src/contract/covid-passport/pkg/crypto"
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
		pkStr, err := ccrypto.MarshalPrivateKey(privateKey)
		if err != nil {
			t.Error(err)
		}

		tfKeyCodeBlock += fmt.Sprintf(tfKeyLine, i, pkStr)
	}
	t.Logf(varCodeBlock, tfKeyCodeBlock)
}

func TestUnmarshalPregeneratedKeys(t *testing.T) {
	if _, err := ccrypto.UnmarshalPrivateKey(tfKey1); err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: TF-1: %w", err)
	}
	if _, err := ccrypto.UnmarshalPrivateKey(tfKey2); err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: TF-2: %w", err)
	}
	if _, err := ccrypto.UnmarshalPrivateKey(tfKey3); err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility: TF-3: %w", err)
	}
}

func TestDhpSignVerify(t *testing.T) {
	// TF-1 key
	tf1PrivKey, err := ccrypto.UnmarshalPrivateKey(tfKey1)
	if err != nil {
		t.Errorf("Error unmarshaling pregenerated ECDSA keypair for Test Facility TF-1: %s", err)
	}
	tf1PubKey := tf1PrivKey.PublicKey

	// Test Patient: Milan
	dhp1, err := GenerateDhp("001", "TF-1-Theresienwiese", tf1PrivKey, "Milan", "PCR", true, time.Time{}, time.Time{})
	if err != nil {
		t.Errorf("Error generating dhp1: %s", err)
	}

	// DEBUG
	t.Logf("Date: %s", dhp1.Data.Date)
	t.Logf("ExpiryDate: %s", dhp1.Data.ExpiryDate)

	// Simulate PubKey Put/Set on channel
	tmp1, err := ccrypto.MarshalPublicKey(&tf1PubKey)
	if err != nil {
		t.Errorf("Error marshaling public key: %s", err)
	}
	tmp2 := []byte(tmp1)
	tmp3 := string(tmp2)
	issCrt, err := ccrypto.UnmarshalPublicKey(tmp3)
	if err != nil {
		t.Errorf("Error unmarshaling public key: %s", err)
	}

	// Validate signature
	data, err := json.Marshal(&dhp1.Data)
	if err != nil {
		t.Errorf("Error marshaling TestResult data inside DHP: %s", err)
	}
	if !ccrypto.ValidateSignature(data, dhp1.Signature, issCrt) {
		t.Errorf("Signature validation failed! \n Issuer: %s \n Signature: %#v \n TestResult: %#v", *issCrt, dhp1.Signature, data)
	}

	// DEBUG
	t.Logf("Issuer: %s \n Signature: %#v \n TestResult: %#v", *issCrt, dhp1.Signature, data)

}
