'use strict';

/**
 *
 */

const MyDocument = require('./mydocument');
const Reader = require('./reader');

class Helper {

    static async getAllResults(iterator){
        let allResults = [];

        while(true){
            let res;
            try{
                res = await iterator.next();
            } catch(err){
                console.log(err);
                return;
            }

            if(res.value && res.value.value.toString()){
                try{
                    let json = JSON.parse(res.value.value.toString('utf8'));
                    if(json.docType === MyDocument.getDocType()){
                        allResults.push(MyDocument.fromJSON(json));
                    } else if(json.docType === Reader.getDocType()){
                        allResults.push(Reader.fromJSON(json));
                    } else {
                        allResults.push(json);
                    }
                } catch(err) {
                    console.log(err);
                    //allResults.push(res.value.value.toString('utf8'));
                }
            }

            if(res.done){
                console.log('end of data');
                await iterator.close();
                return allResults;
            }
        }
    }

    static async throwErrorIfStateExists(iterator, message){
        let res = await Helper.getAllResults(iterator);

        if(res.length > 0){
            throw new Error(message);
        }
    }

}

module.exports = Helper;