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

        let d = new Date();
        let up = d.getSeconds() + 5;
        for(let i = 0; i < up; i++){
            let obj = reviewings.shift();
            reviewings.push(obj);
        }

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
