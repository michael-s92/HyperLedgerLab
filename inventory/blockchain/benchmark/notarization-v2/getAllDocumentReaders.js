/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getAllDocumentReaders {

    static get() {
	    let args;

        /*
            2 different scenario for this test
            1) get all data for arg random
            2) get random document from initDocuments
        */

        let scenario = utils.getRandomInt(3); //200

        // probability 0.5% to chose all random data
        if(scenario === 0){
            console.log("random choosen");

            // select random student
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.allStudent.length);
            } while(seeds.allStudent[randomAccessKey] === undefined);

            let student = seeds.allStudent[randomAccessKey];

            // select random custodian
            randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.allDocId.length);
            } while(seeds.allDocId[randomAccessKey] === undefined);

            let docId = seeds.allDocId[randomAccessKey];

            // getAllDocumentReaders(ctx, documentKey, studentKey)

            args = {
                    chaincodeFunction: 'getAllDocumentReaders',
                    chaincodeArguments: [docId, student.key]
                };

        } else {

            // select random document from initLedgerDocuments
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
            } while(seeds.initDocuments[randomAccessKey] === undefined);

            let doc = seeds.initDocuments[randomAccessKey];

            // getAllDocumentReaders(ctx, documentKey, studentKey)

            args = {
                    chaincodeFunction: 'getAllDocumentReaders',
                    chaincodeArguments: [doc.documentId, doc.student.key]
                };

        }

	    return args;

	}
}

module.exports = getAllDocumentReaders;
