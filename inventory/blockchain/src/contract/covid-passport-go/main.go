package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// ===================================================================================
// Main
// ===================================================================================
func main() {
	// Seed random gen
	rand.Seed(time.Now().UnixNano())

	// Start chaincode
	err := shim.Start(new(CovidPassportChaincode))
	if err != nil {
		fmt.Printf("Error starting DHP chaincode: %s", err)
	}
}
