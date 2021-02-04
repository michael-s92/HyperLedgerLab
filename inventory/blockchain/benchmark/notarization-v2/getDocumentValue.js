/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getDocumentValue {

    static get() {
	    let args;

        // select random reader
        let randomAccessKey = 0;
        do{
            randomAccessKey = utils.getRandomInt(seeds.allReader.length);
        } while(seeds.allReader[randomAccessKey] === undefined);

        let reader = seeds.allReader[randomAccessKey];      

        // select random documentKey
        randomAccessKey = 0;
        do{
            randomAccessKey = utils.getRandomInt(seeds.allDocId.length);
        } while(seeds.allDocId[randomAccessKey] === undefined);

        let docId = seeds.allDocId[randomAccessKey];

        // getDocumentValue(ctx, documentKey, readerName)

        args = {
                chaincodeFunction: 'getDocumentValue',
                chaincodeArguments: [docId, reader]
            };

	    return args;

	}
}

module.exports = getDocumentValue;
