'use strict';

const ReviewingProcess = require('./reviewing_process');

class Helper {

    static objExists(objAsBytes) {
        return objAsBytes && objAsBytes.toString();
    }

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
                    if(json.docType === ReviewingProcess.getDocType()){
                        allResults.push(ReviewingProcess.fromJSON(json));
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

    static async throwErrorIfQueryResultIsNotEmpty(iterator, message){
        let results = await Helper.getAllResults(iterator);

        if(results.length > 0){
            throw new Error(message);
        }
    }

    static async onlyOneResultOrThrowError(iterator, message){
        let results = await Helper.getAllResults(iterator);

        if(results.length === 1){
            return results[0];
        } else {
            throw new Error(message);
        }
    }

}

module.exports = Helper;