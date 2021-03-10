/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class saveChemicalAnalysToBatch {

    static get() {
        let args;

        let randomAccessKey = 0;

        do {
            randomAccessKey = utils.getRandomInt(seeds.initBatchs.length);
        } while (seeds.initBatchs[randomAccessKey] === undefined);

        let batch = seeds.initBatchs[randomAccessKey];

        // -----
        
        do {
            randomAccessKey = utils.getRandomInt(seeds.labResults.length);
        } while (seeds.labResults[randomAccessKey] === undefined);

        let labResult = seeds.labResults[randomAccessKey];


        // saveChemicalAnalysToBatch(ctx, batchId, labId, impurity_percent, broken_percent, damaged_percent, greenisch_percent)
        args = {
            chaincodeFunction: 'saveChemicalAnalysToBatch',
            chaincodeArguments: [batch.id, labResult.labId, labResult.impurity_percent, labResult.broken_percent, labResult.damaged_percent, labResult.greenisch_percent]
        };

        return args;

    }
}

module.exports = saveChemicalAnalysToBatch;
