/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class startReviewingOfArticle {

    static get() {
	    let args;

        let randomAccessKey = 0;

        // select editor
        let editors = seeds.editors;

        do{
            randomAccessKey = utils.getRandomInt(editors.length);
        } while(editors[randomAccessKey] === undefined);

        let editor = editors[randomAccessKey];

        // select article
        let articles = seeds.initArticle;

        let d = new Date();
        let up = d.getSeconds() + 5;
        for(let i = 0; i < up; i++){
            let obj = articles.shift();
            articles.push(obj);
        }

        do{
            randomAccessKey = utils.getRandomInt(articles.length);
        } while(articles[randomAccessKey] === undefined);

        let article = articles[randomAccessKey];

        // select reviewers
        let reviewerIds = [];
        let allReviewerIds = seeds.reviewers.map(e => e.id);
        //reviewerIds = allReviewerIds.slice(0, Utils.getRandomInt(allReviewerIds.length));
        reviewerIds = allReviewerIds;

        // startReviewingOfArticle(ctx, editorId, editorKey, title, authorId, reviewerIds)
	    args = {
                chaincodeFunction: 'startReviewingOfArticle',
                chaincodeArguments: [editor.id, editor.key, article.title, article.author.id, JSON.stringify(reviewerIds)]
            };

	    return args;

	}
}

module.exports = startReviewingOfArticle;
