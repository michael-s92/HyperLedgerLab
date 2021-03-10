/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Batch = require('./batch');
const Helper = require('./helper');

const seeds = require('./seeds.json');


class IoTSupplychainContract extends Contract {

    async init(ctx) {
        console.info('Notarization Contract Initialized');
    }

    async doNothing(ctx) {
        console.log('=========== DoNothing Function');
    }

    async initLedger(ctx) {
        console.log('=========== START: initLedger Transaction');

        for(const batchJson of seeds.initBatchs){
           
            let batch = Batch.fromJSON(batchJson);
            await ctx.stub.putState(batchJson.id, Buffer.from(JSON.stringify(batch)));
        }

        console.log('=========== END  : initLedger Transaction');
    }

    async sendBanchToWarehouse(ctx, batchId, farmerId, warehouseId) {

        if (batchId.length <= 0) {
            throw new Error("batchId must be non empty string");
        }
        if (farmerId.length <= 0) {
            throw new Error("farmerId must be non empty string");
        }
        if (warehouseId.length <= 0) {
            throw new Error("warehouseId must be non empty string");
        }

        // check if that key already existes
        let check = await ctx.stub.getState(batchId);
        if (check && check.toString()) {
            throw new Error(`There is already input for batchId ${batchId}`);
        }

        // create batch object
        let batch = new Batch(batchId, farmerId, warehouseId);

        // save document to the state
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    }

    async saveChemicalAnalysToBatch(ctx, batchId, labId, impurity_percent, broken_percent, damaged_percent, greenisch_percent) {

        if (batchId.length <= 0) {
            throw new Error("BatchId must be non empty string");
        }
        if (labId.length <= 0) {
            throw new Error("labId must be non empty string");
        }
        if (impurity_percent.length <= 0) {
            throw new Error("impurity_percent must be non empty string");
        } else if (isNaN(impurity_percent)) {
            throw new Error("impurity_percent must be a numeric string");
        }
        let impurity = parseInt(impurity_percent);
        if (impurity < 0 || impurity > 100) {
            throw new Error("impurity_percent must be a between 0 and 100");
        }
        if (broken_percent.length <= 0) {
            throw new Error("broken_percent must be non empty string");
        } else if (isNaN(broken_percent)) {
            throw new Error("broken_percent must be a numeric string");
        }
        let broken = parseInt(broken_percent);
        if (broken < 0 || broken > 100) {
            throw new Error("broken_percent must be a between 0 and 100");
        }
        if (damaged_percent.length <= 0) {
            throw new Error("damaged_percent must be non empty string");
        } else if (isNaN(damaged_percent)) {
            throw new Error("damaged_percent must be a numeric string");
        }
        let damaged = parseInt(damaged_percent);
        if (damaged < 0 || damaged > 100) {
            throw new Error("damaged_percent must be a between 0 and 100");
        }
        if (greenisch_percent.length <= 0) {
            throw new Error("greenisch_percent must be non empty string");
        } else if (isNaN(greenisch_percent)) {
            throw new Error("greenisch_percent must be a numeric string");
        }
        let greenisch = parseInt(greenisch_percent);
        if (greenisch < 0 || greenisch > 100) {
            throw new Error("greenisch_percent must be a between 0 and 100");
        }

        // fetch lab, check lab key
        // fetch batch
        let batchAsBytes = await ctx.stub.getState(batchId);
        if (!Helper.objExists) {
            throw new Error(`Batch ${batchId} doesnt exist`);
        }

        let batchJson = {};
        try {
            batchJson = JSON.parse(batchAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse batch ${batchId}, err: ${err}`);
        }

        let batch = Batch.fromJSON(batchJson);

        // check if there is no LabResults
        if (batch.labResult !== undefined) {
            throw new Error(`Batch ${batchId} already has labResults`);
        }

        // store LabResults
        batch.storeLabResults(labId, impurity, broken, damaged, greenisch);

        // save batch to state
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    }

    async savePsysicalAnalysToBatch(ctx, warehouseId, moisture_percent) {

        if (warehouseId.length <= 0) {
            throw new Error("warehouseId must be non empty string");
        }
        if (moisture_percent.length <= 0) {
            throw new Error("moisture_percent must be non empty string");
        } else if (isNaN(moisture_percent)) {
            throw new Error("moisture_percent must be a numeric string");
        }
        let moisture = parseInt(moisture_percent);
        if (moisture < 0 || moisture > 100) {
            throw new Error("moisture_percent must be a between 0 and 100");
        }

        // fetch all batchs that are in warehouse
        let batchQueryString = {};
        batchQueryString.selector = {
            warehouseId: warehouseId,
            inWarehouse: true
        };

        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(batchQueryString));
        let results = await Helper.getAllResultsKeyValue(resultIterator);

        // store enviroment data to them
        for (const obj of results) {
            let tmpBatch = obj.record;
            tmpBatch.pushWarehouseAnalysis(moisture);
            await ctx.stub.putState(obj.key, Buffer.from(JSON.stringify(tmpBatch)));
        }

    }

    async moveBatchToFoodCompany(ctx, batchId) {

        if (batchId.length <= 0) {
            throw new Error("BatchId must be non empty string");
        }

        // fetch batch
        let batchAsBytes = await ctx.stub.getState(batchId);
        if (!Helper.objExists) {
            throw new Error(`Batch ${batchId} doesnt exist`);
        }

        let batchJson = {};
        try {
            batchJson = JSON.parse(batchAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse batch ${batchId}, err: ${err}`);
        }

        let batch = Batch.fromJSON(batchJson);

        // check if there is no LabResults
        if (batch.inWarehouse === undefined || batch.inWarehouse === false) {
            throw new Error(`Batch ${batchId} already has moved`);
        }

        // move batch to producer
        batch.leaveWarehous();

        // save batch to state
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    }

    async calculateDiscount(ctx, batchId) {
        if (batchId.length <= 0) {
            throw new Error("BatchId must be non empty string");
        }

        // fetch batch
        let batchAsBytes = await ctx.stub.getState(batchId);
        if (!Helper.objExists) {
            throw new Error(`Batch ${batchId} doesnt exist`);
        }

        let batchJson = {};
        try {
            batchJson = JSON.parse(batchAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse batch ${batchId}, err: ${err}`);
        }

        let batch = Batch.fromJSON(batchJson);

        // move batch to producer
        batch.calculateDiscount();

        //emit event about discount
        let payload = {
            batch_id: batchId,
            discount: batch.discount
        };
        ctx.stub.setEvent('discount_calculated_event', Buffer.from(JSON.stringify(payload)));

        // save batch to state
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
    }

    async getFarmerRating(ctx, farmerId) {

        if (farmerId.length <= 0) {
            throw new Error("farmerId must be non empty string");
        }

        // fetch all batchs for farmer
        let batchQueryString = {};
        batchQueryString.selector = {
            farmerId: farmerId,
            inWarehouse: false
        };

        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(batchQueryString));
        let results = await Helper.getAllResults(resultIterator);

        let raiting = 0;

        // store enviroment data to them
        for (const batch of results) {

            batch.calculateDiscount();
            raiting += (1 - batch.discount);
        }

        raiting = raiting / results.length;

        let payload = {
            farmerId: farmerId,
            raiting: raiting,
            number: results.length
        };

        return Buffer.from(JSON.stringify(payload));
    }
}

module.exports = IoTSupplychainContract;
