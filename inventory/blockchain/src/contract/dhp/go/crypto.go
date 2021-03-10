package main

import (
	"crypto/ecdsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
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

func marshalPrivateKey(key *ecdsa.PrivateKey) (string, error) {
	pkBB, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		return "", fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return base64.StdEncoding.EncodeToString(pkBB), nil
}

func unmarshalPrivateKey(marshaledKey string) (*ecdsa.PrivateKey, error) {
	upkBB, err := base64.StdEncoding.DecodeString(marshaledKey)
	if err != nil {
		return nil, fmt.Errorf("Error unmarshaling JSON binary to ECDSA: %s", err)
	}
	upKi, err := x509.ParsePKCS8PrivateKey(upkBB)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return upKi.(*ecdsa.PrivateKey), nil
}

func marshalPublicKey(key *ecdsa.PublicKey) (string, error) {
	pkBB, err := x509.MarshalPKIXPublicKey(key)
	if err != nil {
		return "", fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return base64.StdEncoding.EncodeToString(pkBB), nil
}

func unmarshalPublicKey(marshaledKey string) (*ecdsa.PublicKey, error) {
	upkBB, err := base64.StdEncoding.DecodeString(marshaledKey)
	if err != nil {
		return nil, fmt.Errorf("Error unmarshaling JSON binary to ECDSA: %s", err)
	}
	upKi, err := x509.ParsePKIXPublicKey(upkBB)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return upKi.(*ecdsa.PublicKey), nil
}
