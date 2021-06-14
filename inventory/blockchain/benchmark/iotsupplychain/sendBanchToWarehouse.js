/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class sendBanchToWarehouse {

    static get() {
        let args;

        let randomAccessKey = 0;

        do {
            randomAccessKey = utils.getRandomInt(seeds.benchmarkBatchs.length);
        } while (seeds.benchmarkBatchs[randomAccessKey] === undefined);

        let batch = seeds.benchmarkBatchs[randomAccessKey];

        let d = new Date();
        let batchId = batch.id + d.getMinutes() + d.getSeconds();

        // sendBanchToWarehouse(ctx, batchId, farmerId, warehouseId)

        args = {
            chaincodeFunction: 'sendBanchToWarehouse',
            chaincodeArguments: [batchId, batch.farmerId, batch.warehouseId]
        };

        return args;

    }
}

module.exports = sendBanchToWarehouse;
