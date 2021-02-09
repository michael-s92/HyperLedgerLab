#!/usr/bin/env bash

set -e

# cd to project root
cd `dirname $0`/..

# Update the submodule code
set -x
git submodule sync
git submodule update --init --recursive
set +x

# Set environment variables required for Openstack and k8s cluster setup
if [[ -f .env ]]
then
    echo "source .env"
    source .env
else
    echo "Create a .env file. Take env_sample as example"
    exit 1
fi

if [[ $1 = "node" ]]
then
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
elif [[ $1 = "java" ]]
then
    set -x
    rm gradle-5.0-bin.zip
    sudo apt-get remove openjdk-8-jdk gradle
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt install openjdk-8-jdk
    
    wget https://services.gradle.org/distributions/gradle-5.0-bin.zip
    sudo mkdir /opt/gradle
    sudo unzip -d /opt/gradle gradle-5.0-bin.zip
    export PATH=$PATH:/opt/gradle/gradle-5.0/bin
    set +x
else
    # Setup python environment
    if [[ -d venv ]]
    then
        echo "source venv/bin/activate"
        source venv/bin/activate
    else
        set -x
        mkdir venv
        sudo apt update
        #sudo apt-get install --yes python-pip
        curl -O https://bootstrap.pypa.io/2.7/get-pip.py
        python get-pip.py
        sudo python -m pip install --upgrade "pip < 21.0"
        pip install virtualenv
        virtualenv --python=python3 venv
        source ./venv/bin/activate
        pip install -r requirements.txt
        pip install -r kubespray/requirements.txt
        set +x
    fi
fi

# Create ansible.log file if not present
if [[ ! -f ansible.log ]]
then
    touch ansible.log
fi
