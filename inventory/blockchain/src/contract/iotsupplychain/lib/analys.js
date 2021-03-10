'use strict';

/**
 *
 */

class BatchAnalys {

}

class LabResults extends BatchAnalys{

    constructor(labId, impurity_percent, broken_percent, damaged_percent, greenisch_percent) {
        super();
        this.labId = labId;
        this.impurity_percent = impurity_percent;
        this.broken_percent = broken_percent;
        this.damaged_percent = damaged_percent;
        this.greenisch_percent = greenisch_percent;
    }

    static fromJSON(obj){
        if(obj.labId !== undefined && obj.impurity_percent !== undefined && obj.broken_percent !== undefined && obj.damaged_percent !== undefined && obj.greenisch_percent !== undefined){
            return new LabResults(obj.labId, obj.impurity_percent, obj.broken_percent, obj.damaged_percent, obj.greenisch_percent);
        }
    }

}

class WarehouseEnviroment extends BatchAnalys{

    constructor(moisture_percent) {
        super();
        this.moisture_percent = moisture_percent;
    }

    static fromJSON(obj){
        if(obj.moisture_percent !== undefined){
            return new WarehouseEnviroment(obj.moisture_percent);
        }
    }
}


module.exports = { LabResults, WarehouseEnviroment };