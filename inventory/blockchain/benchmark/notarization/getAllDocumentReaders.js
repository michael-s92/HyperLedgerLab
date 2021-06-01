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
            2) get random document from initLedgerDocuments
        */

        //probability for wrong data - 0.001%
        let scenario = utils.getRandomInt(1000);

        if(scenario === 0){

            // select random student
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.allStudent.length);
            } while(seeds.allStudent[randomAccessKey] === undefined);

            let student = seeds.allStudent[randomAccessKey];

            // select random custodian
            randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.allCustodian.length);
            } while(seeds.allCustodian[randomAccessKey] === undefined);

            let custodian = seeds.allCustodian[randomAccessKey];

            // getAllDocumentReaders(ctx, custodianId, studentId, studentKey)

            args = {
                    chaincodeFunction: 'getAllDocumentReaders',
                    chaincodeArguments: [custodian.id, student.id, student.key]
                };

        } else {

            // select random document from initLedgerDocuments
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
            } while(seeds.initDocuments[randomAccessKey] === undefined);

            let doc = seeds.initDocuments[randomAccessKey];

            // getAllDocumentReaders(ctx, custodianId, studentId, studentKey)

            args = {
                    chaincodeFunction: 'getAllDocumentReaders',
                    chaincodeArguments: [doc.custodian.id, doc.student.id, doc.student.key]
                };

        } 

	    return args;

	}
}

module.exports = getAllDocumentReaders;
