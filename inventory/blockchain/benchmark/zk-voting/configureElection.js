/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class configureElection {

    static get() {
	    let args;

        let randomAccessKey = 0;

        // select election
        let elections = seeds.newElections;

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

        let d = new Date();
        let electionId = "[ " + d.getMinutes() + d.getSeconds() + " ]" + election.id;

        // configureElection(ctx, electionId, candidates, adminId, adminKey)
	    args = {
                chaincodeFunction: 'configureElection',
                chaincodeArguments: [electionId, JSON.stringify(election.candidates), admin.id, admin.key]
            };

	    return args;

	}
}

module.exports = configureElection;