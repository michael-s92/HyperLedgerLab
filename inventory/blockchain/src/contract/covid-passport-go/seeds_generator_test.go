package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	mrand "math/rand"
	"path"
	"strconv"
	"time"

	"gopkg.in/yaml.v2"
)

func generateSeeds() error {
	// Seed random gen
	mrand.Seed(time.Now().UnixNano())

	// Read seed params
	seedParamsB, err := ioutil.ReadFile(Config.Seeds.InputParametersPath)
	if err != nil {
		return fmt.Errorf("Error reading seedParameters.yaml: %w", err)
	}
	var seedParams SeedParameters
	if err := yaml.Unmarshal(seedParamsB, &seedParams); err != nil {
		return fmt.Errorf("Error unmarshaling seedParameters.yaml: %w", err)
	}

	// Initialize Seeds
	seeds := Seeds{}

	// Generate Test Facilities
	for i := 0; i < seedParams.NumTestFacilities; i++ {
		tf, err := generateTestFacility(i)
		if err != nil {
			return fmt.Errorf("Error generating Test Facility #%d: %w", i, err)
		}
		seeds.TestFacilities = append(seeds.TestFacilities, *tf)
	}

	// Generate Valid DHPs
	for i := 0; i < seedParams.NumValidDhps; i++ {
		dhp, err := generateValidDhp(i, seeds.TestFacilities)
		if err != nil {
			return fmt.Errorf("Error generating Valid DHP #%d: %w", i, err)
		}
		seeds.ValidDhps = append(seeds.ValidDhps, *dhp)
	}

	// Store seeds.json
	seedsJson, err := json.MarshalIndent(&seeds, "", "  ")
	if err != nil {
		return fmt.Errorf("Error marshaling generated seeds: %w", err)
	}
	if err := ioutil.WriteFile(path.Join("hack", "seed", "seeds.json"), seedsJson, 0644); err != nil {
		return fmt.Errorf("Error writing seeds.json: %w", err)
	}

	return nil
}

func generateTestFacility(ix int) (*SeedTestFacility, error) {
	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("Error generating ECDSA keypair: %w", err)
	}
	privKeyStr, err := MarshalPrivateKey(privKey)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling private key: %w", err)
	}
	pubKeyStr, err := MarshalPublicKey(&privKey.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling public key: %w", err)
	}

	loc := TestFacilityLocations[mrand.Intn(len(TestFacilityLocations))]
	return &SeedTestFacility{
		Id:         fmt.Sprintf("TF-%d-%s", ix, loc),
		PrivateKey: privKeyStr,
		PublicKey:  pubKeyStr,
	}, nil
}

func generateValidDhp(ix int, tfs []SeedTestFacility) (*Dhp, error) {
	tf := tfs[mrand.Intn(len(tfs))]
	tfKey, err := UnmarshalPrivateKey(tf.PrivateKey)
	if err != nil {
		return nil, fmt.Errorf("Error unmarshaling test facility private key: %w", err)
	}
	patientDid := PatientDids[mrand.Intn(len(PatientDids))]

	return generateDhp(strconv.Itoa(ix), tf.Id, tfKey, patientDid,
		TestTypes[mrand.Intn(len(TestTypes))], mrand.Intn(1) == 1,
		time.Now().AddDate(0, 0, -1).Truncate(24*time.Hour),
		time.Now().AddDate(0, 0, 2).Truncate(24*time.Hour),
	)
}

func generateDhp(dhpId, testFacilityId string, testFacilityPrivateKey *ecdsa.PrivateKey,
	patientDid, method string, result bool,
	date, expiryDate time.Time) (*Dhp, error) {

	testResult := TestResult{
		TestFacilityId: testFacilityId,
		Patient:        IdHash(Hash([]byte(patientDid))),
		Method:         TestType(method),
		Result:         result,
		Date:           date,
		ExpiryDate:     expiryDate,
	}
	testResultB, err := json.Marshal(&testResult)
	if err != nil {
		return nil, fmt.Errorf("Error marshaling test result for patient %s at test facility %s: %w", patientDid, testFacilityId, err)
	}
	r, s, err := ecdsa.Sign(rand.Reader, testFacilityPrivateKey, Hash(testResultB))
	if err != nil {
		return nil, fmt.Errorf("Error generating test result signature for patient %s at test facility %s: %w", patientDid, testFacilityId, err)
	}

	return &Dhp{
		Id:   fmt.Sprintf("%s-%s-%s", testFacilityId, patientDid, dhpId),
		Data: testResult,
		Signature: Signature{
			R: r,
			S: s,
		},
	}, nil
}
