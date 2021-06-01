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

        // probability to pick document than doesnt exist - 0.001%
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

            // revokeDocument(ctx, custodianId, studentId, custodianKey)

            args = {
                    chaincodeFunction: 'revokeDocument',
                    chaincodeArguments: [custodian.id, student.id, custodian.key]
                };

        } else {

            // select random document from initDocuments
            let randomAccessKey = 0;
            do{
                randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
            } while(seeds.initDocuments[randomAccessKey] === undefined);

            let doc = seeds.initDocuments[randomAccessKey];

            // revokeDocument(ctx, custodianId, studentId, custodianKey)

            args = {
                    chaincodeFunction: 'revokeDocument',
                    chaincodeArguments: [doc.custodian.id, doc.student.id, doc.custodian.key]
                };

        }

	    return args;

	}
}

module.exports = revokeDocument;
