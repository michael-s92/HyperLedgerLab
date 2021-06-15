module github.com/michael-s92/HyperLedgerLab/inventory/blockchain/src/contract/covid-passport

go 1.12

require (
	github.com/fsouza/go-dockerclient v1.7.3 // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/grpc-ecosystem/go-grpc-middleware v1.3.0 // indirect
	github.com/hyperledger/fabric v2.1.1+incompatible
	github.com/hyperledger/fabric-amcl v0.0.0-20210603140002-2670f91851c8 // indirect
	github.com/miekg/pkcs11 v1.0.3 // indirect
	github.com/op/go-logging v0.0.0-20160315200505-970db520ece7 // indirect
	github.com/spf13/viper v1.7.1 // indirect
	github.com/sykesm/zap-logfmt v0.0.4 // indirect
	go.uber.org/zap v1.17.0 // indirect
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a // indirect
	golang.org/x/net v0.0.0-20210610132358-84b48f89b13b // indirect
	google.golang.org/grpc v1.38.0 // indirect
	gopkg.in/yaml.v2 v2.4.0
)

replace github.com/hyperledger/fabric => github.com/hyperledger/fabric v1.4.1
replace github.com/fsouza/go-dockerclient => github.com/fsouza/go-dockerclient v1.4.2
