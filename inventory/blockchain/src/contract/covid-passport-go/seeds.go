package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

var (
	TestTypes             []string = []string{"PCR", "Antibody"}
	PatientDids           []string = []string{"Agustin", "Elane", "Randal", "Noel", "Shanel", "Piper", "Towanda", "Tameka", "Fidela", "Brittney", "Conception", "Lan", "Fawn", "Garry", "Patrick", "Arnold", "Delcie", "Kim", "Dacia", "Octavio"}
	TestFacilityLocations []string = []string{"Theresienwiese", "Sonnenstraße", "DeutschesMuseum"}
)
var seeds *Seeds = nil

type Seeds struct {
	TestFacilities []SeedTestFacility `json:"testFacilities"`
	ValidDhps      []Dhp              `json:"validDHPs"`
}

type SeedTestFacility struct {
	Id         string `json:"id"`
	PrivateKey string `json:"privateKey"`
	PublicKey  string `json:"publicKey"`
}

type SeedParameters struct {
	NumTestFacilities int `yaml:"numTestFacilities,omitempty"`
	NumValidDhps      int `yaml:"numValidDHPs,omitempty"`
}

func loadSeeds() error {
	if seeds == nil {
		seeds = &Seeds{}
		var seedsB []byte
		var err error
		if Config.Seeds.LoadSeedsFromUrl {
			seedsB, err = loadFromUrl(Config.Seeds.HostedUrl)
		} else {
			seedsB, err = ioutil.ReadFile(Config.Seeds.OutputJsonPath)
		}
		if err != nil {
			return fmt.Errorf("Error loading seeds.json: %w", err)
		}
		if err := json.Unmarshal(seedsB, seeds); err != nil {
			return fmt.Errorf("Error unmarshaling seeds: %w", err)
		}
	}
	return nil
}

func loadFromUrl(url string) ([]byte, error) {
	c := &http.Client{Timeout: 10 * time.Second}
	r, err := c.Get(url)
	if err != nil {
		return nil, fmt.Errorf("Error loading URL: %w", err)
	}
	return ioutil.ReadAll(r.Body)
}
