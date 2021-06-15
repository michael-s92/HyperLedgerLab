package main

import "testing"

func Test_GenerateSeeds(t *testing.T) {
	if err := generateSeeds(); err != nil {
		t.Fatal(err)
	}
}
