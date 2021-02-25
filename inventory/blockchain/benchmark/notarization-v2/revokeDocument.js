/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class revokeDocument {

    static get() {
	    let args;

        /*
            2 different scenario for this test
            1) get all data for arg random
            2) get random document from initDocuments
        */

        let scenario = utils.getRandomInt(3); //200

        //all random with 0.5% probability
        if(scenario === 0){
            console.log("random choosen");
            // select random document id
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.allDocId.length);
            } while(seeds.allDocId[randomAccessKey] === undefined);

            let docId = seeds.allDocId[randomAccessKey];

            // select random custodian
            randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.allCustodian.length);
            } while(seeds.allCustodian[randomAccessKey] === undefined);

            let custodian = seeds.allCustodian[randomAccessKey];

            // revokeDocument(ctx, documentKey, custodianKey) 

            args = {
                    chaincodeFunction: 'revokeDocument',
                    chaincodeArguments: [docId, custodian.key]
                };

        } else {

            // select random document from initDocuments
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
            } while(seeds.initDocuments[randomAccessKey] === undefined);

            let doc = seeds.initDocuments[randomAccessKey];

            // revokeDocument(ctx, documentKey, custodianKey) 

            args = {
                    chaincodeFunction: 'revokeDocument',
                    chaincodeArguments: [doc.documentId, doc.custodian.key]
                };

        } 

	    return args;

	}
}

module.exports = revokeDocument;
