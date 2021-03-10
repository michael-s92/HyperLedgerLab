'use strict';

const fs = require('fs');
const read = require('read-yaml');
const RandExp = require('randexp');
const crypto = require('crypto');

const parameters = read.sync('seedParameters.yaml');

let newHolders = [];
let issuers = [];

// ------------------------- Generate Functions -----------------------

function generateDocumentHash() {
    let doc = new RandExp('.{' + parameters.document_length + '}').gen();
    let hash = crypto.createHash('sha256');
    hash.update(doc);
    return hash.digest('hex');
}

function generateHolder(ind) {
    const idsize = parameters.id_size - 1;
    const id = new RandExp('[a-zA-Z0-9]{' + (idsize - 1) + '}').gen() + ind;
    const travelDoc = generateDocumentHash();

    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 530,    // options 
        publicExponent: 0x10101,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-192-cbc',
            passphrase: ''
        }
    });

    return {
        id: id,
        travelDoc: travelDoc,
        publicKey: publicKey,
        privateKey: privateKey
    };
   
}

function generateIssuer(ind){
    const idsize = parameters.id_size - 1;
    const id = new RandExp('[a-zA-Z0-9]{' + (idsize - 1) + '}').gen() + ind;

    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 530,    // options 
        publicExponent: 0x10101,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-192-cbc',
            passphrase: ''
        }
    });

    return {
        id: id,
        publicKey: publicKey,
        privateKey: privateKey
    };;
}

// --------------------------------------------------------------------

for (let i = 0; i < parameters.newHolders; i++) {
    const user = generateHolder(i);
    newHolders.push(user);
}

for (let i = 0; i < parameters.issuers; i++) {
    const issuer = generateIssuer(i);
    issuers.push(issuer);
}

const json = JSON.stringify({
    newHolders: newHolders,
    issuers: issuers
}, null, 4);

fs.writeFile('seeds.json', json, function (err) {
    if (err) {
        console.log(err);
    }
});

//console.log("=============================== Generate seeds.json done");

/*

type holder struct {
	ObjectType string `json:"docType"`
	Id         string `json:"id"`    
	PublicKey  string `json:"publicKey"`
	TravelDoc  string `json:"travelDoc"`
}

type issuer struct {
	ObjectType string `json:"docType"`
	Id         string `json:"id"`
	PublicKey  string `json:"publicKey"`
}

type digitalHealthPassport struct {
	ObjectType   string   `json:"docType"`
	HolderId     string   `json:"holderId"` 
	IssuerId     string   `json:"issuerId"`
	Timestamp    string   `json:"timestamp"`
	Test         string   `json:"testingMethod"`
	Signature    string   `json:"signature"`
	AccessRights []string `json:"accessRights"`
}

*/