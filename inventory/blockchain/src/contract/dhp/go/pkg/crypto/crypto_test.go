package chaincode

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"encoding/json"
	"testing"
)

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
