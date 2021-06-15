#!/bin/sh

# go run ./hack/seed
go test -timeout 900s -run ^Test_GenerateSeeds$ .
