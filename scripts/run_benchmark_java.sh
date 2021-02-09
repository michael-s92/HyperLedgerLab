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

source `dirname $0`/setup_env.sh java
sleep 30s
base_dir=$INVENTORY_DIR_PATH/blockchain/benchmark
script_dir="$(dirname "$INVENTORY_DIR_PATH")"/scripts
chaincode=fabcar
if [[ ! -z $1 ]]
then
    chaincode=$1
fi

benchmark_dir=$base_dir/$chaincode
contract_dir=$INVENTORY_DIR_PATH/blockchain/src/contract/$chaincode

cd $contract_dir && gradle clean build shadowJar
#cd $contract_dir && npm install
#cd $contract_dir/lib && node generator.js
#cp $contract_dir/lib/seeds.json $benchmark_dir/
cd $benchmark_dir && npm install && node generator.js
#cd $benchmark_dir && node configGenerator.js
$script_dir/fabric_setup.sh -e fabric_orderer_type=kafka -e fabric_create_cli=true
#$script_dir/fabric_setup.sh
#read -p "START NETWORK EMULATION: " ntwrkstart
#echo START NETWORK EMULATION
#sleep 10s
$script_dir/get_metrics.sh $chaincode
$script_dir/fabric_delete.sh
#read -p "STOP NETWORK EMULATION: " ntwrkstop
#echo STOP NETWORK EMULATION
sleep 10s
