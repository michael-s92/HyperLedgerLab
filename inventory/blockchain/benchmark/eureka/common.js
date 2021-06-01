'use strict';

const submittingArticle = require('./submittingArticle');
const startReviewingOfArticle = require('./startReviewingOfArticle');
const reviewArticle = require('./reviewArticle');
const closeReviewingOfArticle = require('./closeReviewingOfArticle');

const pick = require('pick-random-weighted');
var deck = require('deck');

const ALLTESTCASE = [
    submittingArticle,
    startReviewingOfArticle,
    reviewArticle,
    closeReviewingOfArticle
];

// PROVIDE NUMBER OF TESTCASES
let testCasePermuation = [
    0,
    1,
    2,
    3
];

const testCasePermuationWeighted = [
        [ 0, 50 ],
        [ 1, 50 ],
        [ 2, 250 ],
        [ 3, 20 ]
];

function isDefined(t) {
  if (t === undefined) {
     return false;
  }
  return true;
}

module.exports.info = 'Eureka';

let bc, contx;

module.exports.init = function (blockchain, context, args) {
    bc = blockchain;
    contx = context;
    return Promise.resolve();
};
module.exports.run = function () {

    const testPick = pick(testCasePermuationWeighted);
    //let uniformPick = deck.pick(testCasePermuation);
    //console.info('--------------------------- TRANSACTION TO BE INVOKED: ' + ALLTESTCASE[uniformPick]);

    let args = ALLTESTCASE[testPick].get();

    let txstatus = bc.invokeSmartContract(contx, 'eureka', 'v1', args, 120);
    //console.info('TRANSACTION STATUS');

    txstatus.then(function(result) {
	//Endorse errors
	if (isDefined(result[0].Get('endorse_error'))){
		console.info('endorse_error: ', result[0].Get('endorse_error'));
	}
	if (isDefined(result[0].Get('endorse_sig_error'))){
                console.info('endorse_sig_error: ', result[0].Get('endorse_sig_error'));
        }
	if (isDefined(result[0].Get('endorse_denied_error'))){
                console.info('endorse_denied_error: ', result[0].Get('endorse_denied_error'));
        }

	if (isDefined(result[0].Get('endorse_rwmismatch_error'))){
                console.info('endorse_rwmismatch_error: ', result[0].Get('endorse_rwmismatch_error'));
        }

	//Ordering errors
	if (isDefined(result[0].Get('ordering_error'))){
                console.info('ordering_error: ', result[0].Get('ordering_error'));
        }
	//Commit error
	if (isDefined(result[0].Get('commit_error'))){
                console.info('commit_error: ', result[0].Get('commit_error'));
        }
	//Submit Tx all other caught errors (unexpected errors)
	if (isDefined(result[0].Get('submittx_error'))){
                console.info('submittx_error: ', result[0].Get('submittx_error'));
        }
	if (isDefined(result[0].Get('submittx_expected_error'))){
                console.info('submittx_expected_error: ', result[0].Get('submittx_expected_error'));
        }
	//Latencies
	if (isDefined(result[0].Get('endorse_latency'))){
                console.info('endorse_latency: ', result[0].Get('endorse_latency'));
        }
	if (isDefined(result[0].Get('ordering_submission_latency'))){
                console.info('ordering_submission_latency: ', result[0].Get('ordering_submission_latency'));
        }
	if (isDefined(result[0].Get('commit_success_time'))){
                console.info('commit_success_time: ', result[0].Get('commit_success_time'));
        }
	if (isDefined(result[0].Get('orderingandvalidation_time'))){
                console.info('orderingandvalidation_time: ', result[0].Get('orderingandvalidation_time'));
        }
	if (isDefined(result[0].Get('total_transaction_time'))){
                console.info('total_transaction_time: ', result[0].Get('total_transaction_time'));
        }
	if (isDefined(result[0].Get('ordering_broadcast_timeout'))){
                console.info('ordering_broadcast_timeout: ', result[0].Get('ordering_broadcast_timeout'));
        }

    })
    return txstatus;
};

module.exports.end = function () {
return Promise.resolve();
};



