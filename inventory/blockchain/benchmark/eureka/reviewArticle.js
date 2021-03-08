/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class reviewArticle {

    static get() {
	    let args;

        let randomAccessKey;

        // select process
        let reviewings = seeds.openReviewingProcess;
        do{
            randomAccessKey = utils.getRandomInt(reviewings.length);
        } while(reviewings[randomAccessKey] === undefined);

        let reviewing = reviewings[randomAccessKey];

        // select reviewer
        let reviewers = reviewing.reviewers;
        do{
            randomAccessKey = utils.getRandomInt(reviewers.length);
        } while(reviewers[randomAccessKey] === undefined);

        let reviewer = reviewers[randomAccessKey];

        // select review
        let reviews = seeds.defaultReview;
        do{
            randomAccessKey = utils.getRandomInt(reviews.length);
        } while(reviews[randomAccessKey] === undefined);

        let review = reviews[randomAccessKey];

        // reviewArticle(ctx, reviewerId, reviewerKey, authorId, title, mark, comment)
	    args = {
                chaincodeFunction: 'reviewArticle',
                chaincodeArguments: [reviewer.id, reviewer.key, reviewing.author_id, reviewing.title, review.mark, review.comment]
            };

	    return args;

	}
}

module.exports = reviewArticle;
