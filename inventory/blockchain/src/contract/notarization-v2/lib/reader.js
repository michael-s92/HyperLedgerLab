'use strict';

/**
 *
 */

 const docType = 'doc-reader';

class Reader {

    constructor(name, documentKey) {
        this.docType = docType;
        this.name = name;
        this.documentKey = documentKey;
    }

    static getDocType(){
        return docType;
    }

    static fromJSON(obj) {
        if (obj.name !== undefined && obj.documentKey !== undefined) {
            return new MyDocument(obj.name, obj.documentKey);
        }
    }
}

module.exports = Reader;