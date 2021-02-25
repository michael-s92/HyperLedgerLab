/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const MyDocument = require('./mydocument');
const Reader = require('./reader');
const DocumentKey = require('./documentKey');
const Helper = require('./helper');
const sha512 = require('js-sha512');

const seeds = require('./seeds.json');

const documentReaderIndexName = 'document~reader';

class NotarizationV2Contract extends Contract {

    async init(ctx) {
        console.info('Notarization Contract Initialized');
    }

    async doNothing(ctx) {
        console.log('=========== DoNothing Function');
    }

    async initLedger(ctx) {
        console.log('=========== START: initLedger Transaction');

        await ctx.stub.putState(DocumentKey.getKey(), Buffer.from(JSON.stringify(new DocumentKey())));

        for(const doc of seeds.initDocuments){
            // create document object
            let custodianHash = sha512(doc.custodian.key);
            let studentHash = sha512(doc.student.key);
            let newdoc = new MyDocument(doc.documentHash, doc.custodian.id, custodianHash, doc.student.id, studentHash);

            // save document to the state
            await ctx.stub.putState(doc.documentId, Buffer.from(JSON.stringify(newdoc)));

            
            // save all readers of the document
            for(const reader of doc.readers){
                let obj = new Reader(reader, doc.documentId);

                let documentReaderIndexKey = await ctx.stub.createCompositeKey(documentReaderIndexName, [doc.documentId, reader]);
                await ctx.stub.putState(documentReaderIndexKey, Buffer.from(JSON.stringify(obj)));
            }
        }

        console.log('=========== END  : initLedger Transaction');
    }

    async addDocument(ctx, documentHash, custodianId, custodianKey, studentId, studentKey) {
        console.log('=========== START: addDocument Transaction');

        // check all input params
        if(documentHash.length <= 0){
            throw new Error("documentHash must be a non-empty string");
        }
        if(custodianId.length <= 0){
            throw new Error("custodianId must be a non-empty string");
        }
        if(custodianKey.length <= 0){
            throw new Error("custodianKey must be a non-empty string");
        }
        if(studentId.length <= 0){
            throw new Error("studentId must be a non-empty string");
        }
        if(studentKey.length <= 0){
            throw new Error("studentKey must be a non-empty string");
        }

        // check if document exist

        let docExistQueryString = {};
        docExistQueryString.selector = {
            documentHash: documentHash,
            custodianId: custodianId,
            studentId: studentId
        };

        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(docExistQueryString));
        await Helper.throwErrorIfStateExists(resultIterator, `There is already input for student ${studentId} from ${custodianId} with hash: ${documentHash}`);
      
        // get state key

        let keyAsBytes = await ctx.stub.getState(DocumentKey.getKey());
        if(!keyAsBytes || !keyAsBytes.toString()) {
            throw new Error(`Failed to retrive DocumentKey: ${err.description}`);
        } 

        let docKey;
        try{
            let json = JSON.parse(keyAsBytes.toString());
            docKey = DocumentKey.fromJSON(json);
        } catch(err){
            throw new Error(`Failed to decode JSON for DocumentKey: ${err}`);
        }
        

        let newDocKey = docKey.getAndIncrementId();
        await ctx.stub.putState(DocumentKey.getKey(), Buffer.from(JSON.stringify(docKey)));

        // save state to ledger
        let custodianHash = sha512(custodianKey);
        let studentHash = sha512(studentKey);
        let newdoc = new MyDocument(documentHash, custodianId, custodianHash, studentId, studentHash);

        await ctx.stub.putState(newDocKey, Buffer.from(JSON.stringify(newdoc)));

        console.log('=========== END  : addDocument Transaction');
    }

    async getDocumentValue(ctx, documentKey, readerName) {
        console.log('=========== START: getDocumentValue Transaction');

        // check all input params
        if(documentKey.length <=0){
            throw new Error('DocumentKey must be non-empty string');
        }
        if(readerName.length <= 0){
            throw new Error('ReaderName must be non-empty string')
        }

        // get state from ledger
        let docAsBytes = await ctx.stub.getState(documentKey);
        if(!docAsBytes || !docAsBytes.toString()) {
            throw new Error(`Document with key ${documentKey} doesnt exist`);
        }

        let docjson = {};
        try {
            docjson = JSON.parse(docAsBytes.toString());
        } catch(err) {
            throw new Error(`Failed to decode JSON for document ${documentKey}`);
        }
        let doc = MyDocument.fromJSON(docjson);

        // track readers

        let reader = new Reader(readerName, documentKey);

        let documentReaderIndexKey = await ctx.stub.createCompositeKey(documentReaderIndexName, [reader.documentKey, reader.name]);
        await ctx.stub.putState(documentReaderIndexKey, Buffer.from(JSON.stringify(reader)));

        // return document metadata
        console.log('=========== END  : getDocumentValue Transaction');
        return doc.getMetadata();
    }

    async revokeDocument(ctx, documentKey, custodianKey) {
        console.log('=========== START: revokeDocument Transaction');

        // check all input params
        if(documentKey.length <=0){
            throw new Error('DocumentKey must be non-empty string');
        }
        if(custodianKey.length <= 0){
            throw new Error('custodianKey must be non-empty string')
        }

        // retrive entity from ledger
        let docAsBytes = await ctx.stub.getState(documentKey);
        if(!docAsBytes || !docAsBytes.toString()) {
            throw new Error(`Document ${documentKey} doesnt exist`);
        }

        let docjson = {};
        try {
            docjson = JSON.parse(docAsBytes.toString());
        } catch(err) {
            let responsejson = {};
            responsejson.description = `Failed to decode JSON for document ${documentKey}`;
            responsejson.error = err.description;
            throw new Error(responsejson);
        }
        let doc = MyDocument.fromJSON(docjson);

        // check if custodian can revoke document
        let hashedKey = sha512(custodianKey);
        if (hashedKey === doc.custodianHash){
            // revoke document
            doc.setRevoked();
            await ctx.stub.putState(documentKey, Buffer.from(JSON.stringify(doc)));

            console.log('=========== END  : revokeDocument Transaction');
            return doc.getMetadata();
        }

        console.log('=========== END  : revokeDocument Transaction');
    }

    async getAllDocumentReaders(ctx, documentKey, studentKey) {
        console.log('=========== START: addAllDocumentReaders Transaction');

        // check all input params
        if(documentKey.length <=0){
            throw new Error('documentKey must be non-empty string');
        }
        if(studentKey.length <= 0){
            throw new Error('studentKey must be non-empty string')
        }

        // retrive entity from ledger
        let docAsBytes = await ctx.stub.getState(documentKey);
        if(!docAsBytes || !docAsBytes.toString()) {
            throw new Error(`Document ${documentKey} doesnt exist`);
        }

        let docjson = {};
        try {
            docjson = JSON.parse(docAsBytes.toString());
        } catch(err) {
            let responsejson = {};
            responsejson.description = `Failed to decode JSON for Document ${documentKey}`;
            responsejson.error = err.description;
            throw new Error(responsejson);
        }
        let doc = MyDocument.fromJSON(docjson);

        // check if student can revoke get list of all readers
        let hashedKey = sha512(studentKey);
        if (hashedKey === doc.studentHash){
            // get the list of all reader

            let docReaderResultsIterator = await ctx.stub.getStateByPartialCompositeKey(documentReaderIndexName, [documentKey]);
            let readers = await Helper.getAllResults(docReaderResultsIterator);
            
            let metadata = doc.getMetadata();
            metadata.readers = readers;

            console.log('=========== END  : getAllDocumentReaders Transaction');

            return metadata;
        }

        console.log('=========== END  : getAllDocumentReaders Transaction');
    }
}

module.exports = NotarizationV2Contract;
