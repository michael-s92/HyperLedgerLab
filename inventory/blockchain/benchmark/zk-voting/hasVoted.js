/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class hasVoted {

    static get() {
	    let args;

        let randomAccessKey = 0;

        // select election
        let elections = seeds.initElections;

        do{
            randomAccessKey = utils.getRandomInt(elections.length);
        } while(elections[randomAccessKey] === undefined);

        let election = elections[randomAccessKey];

        // select voter
        let voters = seeds.voters;

        do{
            randomAccessKey = utils.getRandomInt(voters.length);
        } while(voters[randomAccessKey] === undefined);

        let voter = voters[randomAccessKey];


        // hasVoted(ctx, electionId, voterId)
	    args = {
                chaincodeFunction: 'hasVoted',
                chaincodeArguments: [election.id, voter]
            };

	    return args;

	}
}

module.exports = hasVoted;
