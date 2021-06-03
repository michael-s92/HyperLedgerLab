/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class revokeDocument {

    static get() {
        let args;

        // select random document from initDocuments
        let randomAccessKey = 0;
        do {
            randomAccessKey = utils.getRandomInt(seeds.initDocuments.length);
        } while (seeds.initDocuments[randomAccessKey] === undefined);

        let doc = seeds.initDocuments[randomAccessKey];

        // revokeDocument(ctx, custodianId, studentId, custodianKey)

        args = {
            chaincodeFunction: 'revokeDocument',
            chaincodeArguments: [doc.custodian.id, doc.student.id, doc.custodian.key]
        };

        return args;

    }
}

module.exports = revokeDocument;
