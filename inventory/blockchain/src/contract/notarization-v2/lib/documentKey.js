'use strict';

/**
 *
 */

const Key = "notarization-v2-next-state-document-id";
const StartValue = 100000;
const Prefix = "document-id-"

class DocumentKey {

    constructor(nextId) {
        this.docType = 'doc-next-id';
        this.nextId = (nextId === undefined) ? StartValue : nextId;
    }

    getAndIncrementId(){
        this.nextId++;
        return Prefix + this.nextId;
    }

    static getKey(){
        return Key;
    }

    static fromJSON(obj) {
        if (obj.nextId !== undefined) {
            return new MyDocument(obj.nextId);
        }
    }
}

module.exports = DocumentKey;