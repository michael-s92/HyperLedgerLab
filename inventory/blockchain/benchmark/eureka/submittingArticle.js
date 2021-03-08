/* eslint-disable no-undef */
'use strict';

const utils = require('./utils');
const seeds = require('./seeds.json');

class submittingArticle {

    static get() {
	    let args;

        let randomAccessKey = 0;
        let articles = seeds.newArticles;

        do{
            randomAccessKey = utils.getRandomInt(articles.length);
        } while(articles[randomAccessKey] === undefined);

        let article = articles[randomAccessKey];


        // submittingArticle(ctx, title, author_id, coauthor_ids, ref_author_ids, fee, lref, authorKey)
	    args = {
                chaincodeFunction: 'submittingArticle',
                chaincodeArguments: [article.title, article.author.id, JSON.stringify(article.coauthor_ids), JSON.stringify(article.refauthor_ids), article.fee, article.lref, article.author.key]
            };

	    return args;

	}
}

module.exports = submittingArticle;
