/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class moveBatchToFoodCompany {

    static get() {
        let args;

        let randomAccessKey = 0;

        do {
            randomAccessKey = utils.getRandomInt(seeds.initBatchs.length);
        } while (seeds.initBatchs[randomAccessKey] === undefined);

        let batch = seeds.initBatchs[randomAccessKey];

        // moveBatchToFoodCompany(ctx, batchId)

        args = {
            chaincodeFunction: 'moveBatchToFoodCompany',
            chaincodeArguments: [batch.id]
        };

        return args;

    }
}

module.exports = moveBatchToFoodCompany;
