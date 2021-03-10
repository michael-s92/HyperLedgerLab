/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class getFarmerRating {

    static get() {
        let args;

        let randomAccessKey = 0;

        do {
            randomAccessKey = utils.getRandomInt(seeds.initBatchs.length);
        } while (seeds.initBatchs[randomAccessKey] === undefined);

        let batch = seeds.initBatchs[randomAccessKey];

        // getFarmerRating(ctx, batchId)

        args = {
            chaincodeFunction: 'getFarmerRating',
            chaincodeArguments: [batch.id]
        };

        return args;

    }
}

module.exports = getFarmerRating;
