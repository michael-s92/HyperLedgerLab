'use strict';

/**
 *
 */

const { LabResults, WarehouseEnviroment } = require('./analys');

const docType = 'batch-doc';

class Batch {

    constructor(id, farmerId, warehouseId, inWarehouse, labResult, warehouseAnalysis, discount) {
        this.docType = docType;
        this.id = id;
        this.farmerId = farmerId;
        this.warehouseId = warehouseId;
        this.inWarehouse = (inWarehouse === undefined) ? true : inWarehouse;
        this.labResult = labResult;
        this.warehouseAnalysis = (warehouseAnalysis === undefined) ? [] : warehouseAnalysis;
        this.discount = (discount === undefined) ? 0 : discount;
    }

    leaveWarehous() {
        this.inWarehouse = false;
    }

    //TODO: calculate discount: look at labResults and iterate over warehouseAnalysis
    calculateDiscount() {
        let avg_moisture = 0;
        this.warehouseAnalysis.forEach(e => avg_moisture += e.moisture_percent);
        avg_moisture = avg_moisture / this.warehouseAnalysis.length;

        let discount = 0;

        if (avg_moisture > 12) {
            discount += (avg_moisture - 12) * 4;
        }
        if (this.labResult.impurity_percent > 3) {
            discount += (this.labResult.impurity_percent - 3) * 2.5;
        }
        if (this.labResult.broken_percent > 5) {
            discount += (this.labResult.broken_percent - 5) * 1;
        }
        if (this.labResult.damaged_percent > 3) {
            discount += (this.labResult.damaged_percent - 3) * 3.5;
        }

        this.discount = discount;
    }

    pushWarehouseAnalysis(moisture_percent) {
        this.warehouseAnalysis.push(new WarehouseEnviroment(moisture_percent));
    }

    storeLabResults(labId, impurity_percent, broken_percent, damaged_percent, greenisch_percent) {
        this.labResult = new LabResults(labId, impurity_percent, broken_percent, damaged_percent, greenisch_percent);
    }


    static fromJSON(obj) {

        if (obj.id !== undefined && obj.farmerId !== undefined && obj.warehouseId !== undefined) {

            let labResult;
            if (obj.labResult !== undefined) {
                labResult = LabResults.fromJSON(obj.labResult);
            }

            let warehouseAnalysis = [];
            if (obj.warehouseAnalysis !== undefined) {
                obj.warehouseAnalysis.forEach(e => {
                    if (e !== undefined) {
                        warehouseAnalysis.push(WarehouseEnviroment.fromJSON(e));
                    }
                });
            }

            return new Batch(obj.id, obj.farmerId, obj.warehouseId, obj.inWarehouse, labResult, warehouseAnalysis, obj.discount);
        }
    }

    static getDocType() {
        return docType;
    }
}

module.exports = Batch;