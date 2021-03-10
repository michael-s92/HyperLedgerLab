package chaincode

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"path"
)

var seeds *Seeds = nil

type Seeds struct {
	ValidDhps []Dhp `json:"validDHPs"`
}

func SeedRandomValidDhp() (Dhp, error) {
	if err := loadSeeds(); err != nil {
		return Dhp{}, err
	}
	return seeds.ValidDhps[rand.Intn(len(seeds.ValidDhps))], nil
}

func loadSeeds() error {
	if seeds == nil {
		seedsB, err := ioutil.ReadFile(path.Join("hack", "seed", "seeds.json"))
		if err != nil {
			return fmt.Errorf("Error loading seeds.json: %w", err)
		}
		if err := json.Unmarshal(seedsB, seeds); err != nil {
			return fmt.Errorf("Error unmarshaling seeds: %w", err)
		}
	}
	return nil
}
