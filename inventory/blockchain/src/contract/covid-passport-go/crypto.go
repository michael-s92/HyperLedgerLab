package main

import (
	"crypto/ecdsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"math/big"
)

// Signature wraps a ECDSA signature.
type Signature struct {
	R *big.Int `json:"r"`
	S *big.Int `json:"s"`
}

// Helper function to validate ECDSA signature of message against IssuerCert
func ValidateSignature(message []byte, signature Signature, certificate *ecdsa.PublicKey) bool {
	hash := Hash(message)
	return ecdsa.Verify(certificate, hash, signature.R, signature.S)
}

// Helper function to compute the SHA256 Hash of the given data.
func Hash(b []byte) []byte {
	sha := sha256.Sum256(b)
	shaStr := hex.EncodeToString(sha[:])
	return []byte(shaStr)
}

func MarshalPrivateKey(key *ecdsa.PrivateKey) (string, error) {
	pkBB, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		return "", fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return base64.StdEncoding.EncodeToString(pkBB), nil
}

func UnmarshalPrivateKey(marshaledKey string) (*ecdsa.PrivateKey, error) {
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

func MarshalPublicKey(key *ecdsa.PublicKey) (string, error) {
	pkBB, err := x509.MarshalPKIXPublicKey(key)
	if err != nil {
		return "", fmt.Errorf("Error marshaling ECDSA to binary: %s", err)
	}
	return base64.StdEncoding.EncodeToString(pkBB), nil
}

func UnmarshalPublicKey(marshaledKey string) (*ecdsa.PublicKey, error) {
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
