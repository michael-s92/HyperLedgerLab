/* eslint-disable no-undef */
'use strict';

class benchmarkUploadDhpValid {

    static get() {

        let d = new Date();
        let a = d.getHours() + d.getMinutes() + d.getSeconds() + "";

        // PurgeExpiredDhps()
	    let args = {
                chaincodeFunction: 'benchmarkUploadDhpValid',
                chaincodeArguments: [a]
            };

	    return args;

	}
}

module.exports = benchmarkUploadDhpValid;
