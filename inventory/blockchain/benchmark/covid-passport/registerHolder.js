/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class registerHolder {

    static get() {
	    let args;

        let randomAccessKey = 0;

        do{
            randomAccessKey = utils.getRandomInt(seeds.newHolders.length);
        } while(seeds.newHolders[randomAccessKey] === undefined);

        let holder = seeds.newHolders[randomAccessKey];

        // Args: holderId, publicKey, travelDoc

	    args = {
                chaincodeFunction: 'registerHolder',
                chaincodeArguments: [holder.id, holder.publicKey, holder.travelDoc]
            };

	    return args;

	}
}

module.exports = registerHolder;