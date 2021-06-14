/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getCandidates {

    static get() {
	    let args;

        let randomAccessKey;

        // select election
        let elections = seeds.initElections;

        do{
            randomAccessKey = utils.getRandomInt(elections.length);
        } while(elections[randomAccessKey] === undefined);

        let election = elections[randomAccessKey];

        // getCandidates(ctx, electionId)
	    args = {
                chaincodeFunction: 'getCandidates',
                chaincodeArguments: [election.id]
            };

	    return args;

	}
}

module.exports = getCandidates;
