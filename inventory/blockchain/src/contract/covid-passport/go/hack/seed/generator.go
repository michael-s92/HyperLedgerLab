package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"path"
	"strconv"
	"time"

	"gopkg.in/yaml.v2"

	"github.com/michael-s92/HyperLedgerLab/inventory/blockchain/src/contract/covid-passport/pkg/chaincode"
	ccrypto "github.com/michael-s92/HyperLedgerLab/inventory/blockchain/src/contract/covid-passport/pkg/crypto"
)

type SeedParameters struct {
	AllValidDhp int `yaml:"allValidDHP,omitempty"`
}

func generateValidDhp(ix int) (*chaincode.Dhp, error) {
	tfId := rand.Intn(len(chaincode.TfKeys))
	tfKey, err := ccrypto.UnmarshalPrivateKey(chaincode.TfKeys[tfId])
	if err != nil {
		return nil, fmt.Errorf("Error unmarshaling private key: %w", err)
	}
	patientDid := PatientDids[rand.Intn(len(PatientDids))]

	// fmt.Printf("PatientDID: %s", patientDid)
	// fmt.Printf("SHA256(PatientDID: %s", (ccrypto.Hash([]byte(patientDid))))

	return chaincode.GenerateDhp(strconv.Itoa(ix), strconv.Itoa(tfId), tfKey, patientDid,
		TestTypes[rand.Intn(len(TestTypes))], rand.Intn(1) == 1,
		time.Now().AddDate(0, 0, -1).Truncate(24*time.Hour),
		time.Now().AddDate(0, 0, 2).Truncate(24*time.Hour),
	)
}

func main() {
	// Seed random gen
	rand.Seed(time.Now().UnixNano())

	// Read seed params
	seedParamsB, err := ioutil.ReadFile(path.Join("hack", "seed", "seedParameters.yaml"))
	if err != nil {
		fmt.Printf("Error reading seedParameters.yaml: %s", err)
		os.Exit(1)
	}
	var seedParams SeedParameters
	if err := yaml.Unmarshal(seedParamsB, &seedParams); err != nil {
		fmt.Printf("Error unmarshaling seedParameters.yaml: %s", err)
		os.Exit(1)
	}

	// Initialize Seeds
	seeds := chaincode.Seeds{}

	// Generate Valid DHPs
	for i := 0; i < seedParams.AllValidDhp; i++ {
		dhp, err := generateValidDhp(i)
		if err != nil {
			fmt.Printf("Error generating Valid DHP #%d: %s", i, err)
			os.Exit(1)
		}
		seeds.ValidDhps = append(seeds.ValidDhps, *dhp)
	}

	// Store seeds.json
	seedsJson, err := json.Marshal(&seeds)
	if err != nil {
		fmt.Printf("Error marshaling generated seeds: %s", err)
		os.Exit(1)
	}
	if err := ioutil.WriteFile(path.Join("hack", "seed", "seeds.json"), seedsJson, 0644); err != nil {
		fmt.Printf("Error writing seeds.json: %s", err)
		os.Exit(1)
	}
}
