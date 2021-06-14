/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getResults {

    static get() {
	    let args;

        let randomAccessKey;

        // select election
        let elections = seeds.initElections;

        do{
            randomAccessKey = utils.getRandomInt(elections.length);
        } while(elections[randomAccessKey] === undefined);

        let election = elections[randomAccessKey];

        // getResults(ctx, electionId)
	    args = {
                chaincodeFunction: 'getResults',
                chaincodeArguments: [election.id]
            };

	    return args;

	}
}

module.exports = getResults;
