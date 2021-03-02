/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getDocumentValue {

    static get() {
	    let args;

        /*
            2 different scenario for this test
            1) get all data for arg random
            2) get random document from initDocuments
        */

        // select random reader
        let randomAccessKey = 0;
        do{
            randomAccessKey = utils.getRandomInt(seeds.allReader.length);
        } while(seeds.allReader[randomAccessKey] === undefined);

        let reader = seeds.allReader[randomAccessKey];  


        // lets set that just 0.5% of all cases can be an error with random data
        let scenario = utils.getRandomInt(200);

        if(scenario === 0){

            // select random student
            randomAccessKey = 0;
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

            // getDocumentValue(ctx, custodianId, studentId, readerName)

            args = {
                    chaincodeFunction: 'getDocumentValue',
                    chaincodeArguments: [custodian.id, student.id, reader]
                };

        } else {
            
            // select random document from initDocuments
            randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
            } while(seeds.initDocuments[randomAccessKey] === undefined);

            let doc = seeds.initDocuments[randomAccessKey];

            // getDocumentValue(ctx, custodianId, studentId, readerName)

            args = {
                    chaincodeFunction: 'getDocumentValue',
                    chaincodeArguments: [doc.custodian.id, doc.student.id, reader]
                };

        }

	    return args;

	}
}

module.exports = getDocumentValue;
