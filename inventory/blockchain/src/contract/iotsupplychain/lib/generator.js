'use strict';

const fs = require('fs');
const read = require('read-yaml');
const RandExp = require('randexp');

const Utils = require('./utils');

const parameters = read.sync('seedParameters.yaml');

let farmers = [];
let warehouses = [];
let initBatchs = [];
let benchmarkBatchs = [];
let labResults = [];
let warehouseEnvs = [];

function generateBatch(ind, type){
   
    let id = Utils.generateRandomLetters(parameters.batchIdSize) + ':' + type + ind;
    let farmerId = farmers[Utils.getRandomInt(farmers.length)];
    let warehouseId = warehouses[Utils.getRandomInt(warehouses.length)];

    return {
        id: id,
        farmerId: farmerId,
        warehouseId: warehouseId
    };
}

function generateWarehouseEnviroment(){
    
    let moisure = Utils.getRandomPercent().toString();
    let warehouseId = warehouses[Utils.getRandomInt(warehouses.length)];

    return {
        warehouseId: warehouseId,
        moisure: moisure
    };
}

function generateLabResults(){

    let labId = 'LAB' + Utils.getRandomInt(1000);
    let impurity_percent = Utils.getRandomPercent().toString();
    let broken_percent = Utils.getRandomPercent().toString();
    let damaged_percent = Utils.getRandomPercent().toString();
    let greenisch_percent = Utils.getRandomPercent().toString();

    return {
        labId: labId,
        impurity_percent: impurity_percent,
        broken_percent: broken_percent,
        damaged_percent: damaged_percent,
        greenisch_percent: greenisch_percent
    };
}

for (let i = 0; i < parameters.farmers; i++) {
    const farmer = Utils.generateRandomLetters(20) + ':F' + i;
    farmers.push(farmer);
}

for (let i = 0; i < parameters.warehouses; i++) {
    const warehouse = Utils.generateRandomLetters(20) + ':W' + i;
    warehouses.push(warehouse);
}

for (let i = 0; i < parameters.initBatchs; i++) {
    const batch = generateBatch(i, 'I');
    initBatchs.push(batch);
}

for (let i = 0; i < parameters.benchmarkBatchs; i++) {
    const batch = generateBatch(i, 'B');
    benchmarkBatchs.push(batch);
}

for (let i = 0; i < parameters.labResults; i++) {
    labResults.push(generateLabResults());
}

for (let i = 0; i < parameters.enviroments; i++) {
    warehouseEnvs.push(generateWarehouseEnviroment());
}

const json = JSON.stringify({
    farmers: farmers,
    warehouses: warehouses,
    initBatchs: initBatchs,
    benchmarkBatchs: benchmarkBatchs,
    labResults: labResults,
    warehouseEnvs: warehouseEnvs
}, null, 4);

fs.writeFile('seeds.json', json, function(err) {
    if (err) {
        console.log(err);
    }
});

//console.log("=============================== Generate seeds.json done");
