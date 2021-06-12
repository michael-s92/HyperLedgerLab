/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class closeReviewingOfArticle {

    static get() {
	    let args;

        let randomAccessKey;

        // select process
        let reviewings = seeds.reviewerForClosing;
        do{
            randomAccessKey = utils.getRandomInt(reviewings.length);
        } while(reviewings[randomAccessKey] === undefined);

        let reviewing = reviewings[randomAccessKey];


        // closeReviewingOfArticle(ctx, editorId, editorKey, authorId, title)
	    args = {
                chaincodeFunction: 'closeReviewingOfArticle',
                chaincodeArguments: [reviewing.editor.id, reviewing.editor.key, reviewing.author_id, reviewing.title]
            };

	    return args;

	}
}

module.exports = closeReviewingOfArticle;
