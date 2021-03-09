package main

import (
	"crypto/ecdsa"
	"crypto/sha256"
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
