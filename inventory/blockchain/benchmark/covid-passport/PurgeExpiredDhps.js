/* eslint-disable no-undef */
'use strict';

class PurgeExpiredDhps {

    static get() {

        // PurgeExpiredDhps()
	    let args = {
                chaincodeFunction: 'PurgeExpiredDhps',
                chaincodeArguments: []
            };

	    return args;

	}
}

module.exports = PurgeExpiredDhps;
