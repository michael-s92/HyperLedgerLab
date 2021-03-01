#!/usr/bin/env bash
# Script to run benchmark for a chaincode
# Chaincode defaults to marbles
# Chaincode name can be provided by CLI: e.g get_metrics.sh fabcar

if [[ ! -d node_modules ]]
then
    # Setup node environment
    set -x
    sudo apt-get remove nodejs npm
    sudo apt-get update
    sudo apt-get upgrade
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    npm install npm@latest-6
    #sudo npm install -g npm
    npm install
    npm run fabric-v1.4-deps
    set +x
fi
    
    
chaincode=fabcar
if [[ ! -z $1 ]]
then
    chaincode=$1
fi

benchmark_dir=inventory/blockchain/benchmark/$chaincode
cd $benchmark_dir && npm install # && node generator.js
cp $benchmark_dir/seeds.json $contract_dir/


cd ~/HyperLedgerLab
script_dir=./scripts

$script_dir/fabric_setup.sh -e fabric_orderer_type=kafka -e fabric_create_cli=true
$script_dir/get_metrics.sh $chaincode
sleep 10s
$script_dir/fabric_delete.sh
sleep 10s
