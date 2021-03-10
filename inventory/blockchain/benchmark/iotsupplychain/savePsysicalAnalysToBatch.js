/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class savePsysicalAnalysToBatch {

    static get() {
        let args;

        let randomAccessKey = 0;

        do {
            randomAccessKey = utils.getRandomInt(seeds.warehouseEnvs.length);
        } while (seeds.warehouseEnvs[randomAccessKey] === undefined);

        let env = seeds.warehouseEnvs[randomAccessKey];


        // savePsysicalAnalysToBatch(ctx, warehouseId, moisture_percent)
        args = {
            chaincodeFunction: 'savePsysicalAnalysToBatch',
            chaincodeArguments: [env.warehouseId, env.moisure]
        };

        return args;

    }
}

module.exports = savePsysicalAnalysToBatch;
