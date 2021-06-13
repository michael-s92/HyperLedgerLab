/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class reviewArticle {

    static get() {
	    let args;

        let randomAccessKey;

        // select process
        let openProcess = seeds.openReviewingProcess;
        do{
            randomAccessKey = utils.getRandomInt(openProcess.length);
        } while(openProcess[randomAccessKey] === undefined);

        let reviewingProcess = openProcess[randomAccessKey];

        // select reviewer
        let reviewers = reviewingProcess.reviewers;
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
        // second transaction posible: reviewArticleQuery
	    args = {
                chaincodeFunction: 'reviewArticle',
                chaincodeArguments: [reviewer.id, reviewer.key, reviewingProcess.author_id, reviewingProcess.title, review.mark, review.comment]
            };

	    return args;

	}
}

module.exports = reviewArticle;
