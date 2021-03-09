package main

import (
	"crypto/ecdsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/json"
	"fmt"
)

// Helper function to validate ECDSA signature of message against IssuerCert
func validateSignature(message []byte, signature Signature, certificate IssuerCert) bool {
	hash := hash(message)
	return ecdsa.Verify(certificate, hash, signature.R, signature.S)
}

// Helper function to compute the SHA256 hash of the given string of bytes.
func hash(b []byte) []byte {
	h := sha256.New()
	h.Write(b)
	return h.Sum(nil)
}

func marshalPrivateKey(key *ecdsa.PrivateKey) ([]byte, error) {
	pkBB, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	pkBJ, err := json.Marshal(&pkBB)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA binary to JSON: %s", err)
	}
	return pkBJ, nil
}

func unmarshalPrivateKey(marshaledKey []byte) (*ecdsa.PrivateKey, error) {
	var upkBB []byte
	if err := json.Unmarshal(marshaledKey, &upkBB); err != nil {
		return nil, fmt.Errorf("Error unmarshaling JSON binary to ECDSA: %s", err)
	}
	upKi, err := x509.ParsePKCS8PrivateKey(upkBB)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return upKi.(*ecdsa.PrivateKey), nil
}

func marshalPublicKey(key *ecdsa.PublicKey) ([]byte, error) {
	pkBB, err := x509.MarshalPKIXPublicKey(key)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	pkBJ, err := json.Marshal(&pkBB)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA binary to JSON: %s", err)
	}
	return pkBJ, nil
}

func unmarshalPublicKey(marshaledKey []byte) (*ecdsa.PublicKey, error) {
	var upkBB []byte
	if err := json.Unmarshal(marshaledKey, &upkBB); err != nil {
		return nil, fmt.Errorf("Error unmarshaling JSON binary to ECDSA: %s", err)
	}
	upKi, err := x509.ParsePKIXPublicKey(upkBB)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return upKi.(*ecdsa.PublicKey), nil
}
