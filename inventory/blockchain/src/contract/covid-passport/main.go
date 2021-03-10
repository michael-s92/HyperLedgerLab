package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"

	"github.com/michael-s92/HyperLedgerLab/inventory/blockchain/src/contract/covid-passport/pkg/chaincode"
)

// ===================================================================================
// Main
// ===================================================================================
func main() {
	// Seed random gen
	rand.Seed(time.Now().UnixNano())

	// Start chaincode
	err := shim.Start(new(chaincode.CovidPassportChaincode))
	if err != nil {
		fmt.Printf("Error starting DHP chaincode: %s", err)
	}
}
