'use strict';

/**
 *
 */

class Admins {

    constructor(id, hashedKey) {
        this.docType = "doc-admin";
        this.id = id;
        this.hashedKey = hashedKey;
    }

    static fromJSON(obj){
        if (obj.id !== undefined && obj.hashedKey !== undefined){
            return new Admins(obj.id, obj.hashedKey)
        }
    }
}

module.exports = Admins;