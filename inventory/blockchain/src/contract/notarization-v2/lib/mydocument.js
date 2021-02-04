'use strict';

/**
 *
 */

const cvalid = 'valid';
const crevoked = 'revoked';

const docType = 'my-document';

class MyDocument {

    constructor(documentHash, custodianId, custodianHash, studentId, studentHash, status) {
        this.docType = docType;
        this.documentHash = documentHash;
        this.custodianId = custodianId;
        this.custodianHash = custodianHash;
        this.studentId = studentId;
        this.studentHash = studentHash;
        this.status = (status === undefined) ? cvalid : status;
    }

    setRevoked() {
        this.status = crevoked;
    }

    getMetadata(){
        var metadata = {
            document_hash: this.documentHash,
            document_value: this.status,
            custodian_id: this.custodianId,
            student_id: this.studentId,
        };
        return metadata;
    }

    static getDocType(){
        return docType;
    }

    static fromJSON(obj) {
        if (obj.documentHash !== undefined && obj.custodianId !== undefined && obj.custodianHash !== undefined && obj.studentId !== undefined && obj.studentHash !== undefined) {
            return new MyDocument(obj.documentHash, obj.custodianId, obj.custodianHash, obj.studentId, obj.studentHash, obj.status);
        }
    }
}

module.exports = MyDocument;