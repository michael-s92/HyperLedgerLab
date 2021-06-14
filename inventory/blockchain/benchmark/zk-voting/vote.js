/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class vote {

    static get() {
	    let args;

        let randomAccessKey = 0;

        // select election
        let elections = seeds.initElections;

        do{
            randomAccessKey = utils.getRandomInt(elections.length);
        } while(elections[randomAccessKey] === undefined);

        let election = elections[randomAccessKey];

        // select candidat
        let candidates = election.candidates;

        do{
            randomAccessKey = utils.getRandomInt(candidates.length);
        } while(candidates[randomAccessKey] === undefined);

        let candidat = candidates[randomAccessKey];

        // select voter
        let voters = seeds.voters;

        do{
            randomAccessKey = utils.getRandomInt(voters.length);
        } while(voters[randomAccessKey] === undefined);

        let d = new Date();
        let voter = voters[randomAccessKey] + d.getSeconds();


        // vote(ctx, electionId, voterId, candidat)
	    args = {
                chaincodeFunction: 'vote',
                chaincodeArguments: [election.id, voter, candidat]
            };

	    return args;

	}
}

module.exports = vote;
