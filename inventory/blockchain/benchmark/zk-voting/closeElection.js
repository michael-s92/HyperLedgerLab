/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class closeElection {

    static get() {
	    let args;

        let randomAccessKey = 0;

        // select election
        let elections = seeds.initElections;

        do{
            randomAccessKey = utils.getRandomInt(elections.length);
        } while(elections[randomAccessKey] === undefined);

        let election = elections[randomAccessKey];

        // select admin
        let admins = seeds.admins;

        do{
            randomAccessKey = utils.getRandomInt(admins.length);
        } while(admins[randomAccessKey] === undefined);

        let admin = admins[randomAccessKey];

        // closeElection(ctx, electionId, adminId, adminKey)
	    args = {
                chaincodeFunction: 'closeElection',
                chaincodeArguments: [election.id, admin.id, admin.key]
            };

	    return args;

	}
}

module.exports = closeElection;
