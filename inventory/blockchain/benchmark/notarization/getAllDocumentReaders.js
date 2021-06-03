/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getAllDocumentReaders {

    static get() {
        let args;

        // select random document from initLedgerDocuments
        let randomAccessKey = 0;
        do {
            randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
        } while (seeds.initDocuments[randomAccessKey] === undefined);

        let doc = seeds.initDocuments[randomAccessKey];

        // getAllDocumentReaders(ctx, custodianId, studentId, studentKey)

        args = {
            chaincodeFunction: 'getAllDocumentReaders',
            chaincodeArguments: [doc.custodian.id, doc.student.id, doc.student.key]
        };


        return args;

    }
}

module.exports = getAllDocumentReaders;
