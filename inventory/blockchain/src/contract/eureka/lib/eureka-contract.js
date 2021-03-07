/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Article = require('./article');
const { Author, Editor, Reviewer } = require('./users');
const ReviewingProcess = require('./reviewing_process');
const { ArticleSubmittedEvent, DoReviewEvent, ReviewDoneEvent } = require('./chaincode_events');
const Helper = require('./helper');
const sha512 = require('js-sha512');

const seeds = require('./seeds.json');

const authorTitleIndexName = "author~title";
const authorTitleReviewingIndexName = "author~title~reviewing";

class EurekaContract extends Contract {

    async init(ctx) {
        console.info('Eureka Contract Initialized');
    }

    async doNothing(ctx) {
        console.info("DoNothing Transaction Invoked");
    }

    async initLedger(ctx) {
        console.info("InitLedger Transaction Invoked");

        //init authors
        for (const author of seeds.authors) {
            let hashedKey = sha512(author.key);
            let objAuthor = new Author(author.id, author.name, hashedKey);
            await ctx.stub.putState(author.id, Buffer.from(JSON.stringify(objAuthor)));
        }

        //init editors
        for (const editor of seeds.editors) {
            let hashedKey = sha512(editor.key);
            let objEditor = new Editor(editor.id, editor.name, hashedKey);
            await ctx.stub.putState(editor.id, Buffer.from(JSON.stringify(objEditor)));
        }

        //init reviewers
        for (const reviewer of seeds.reviewers) {
            let hashedKey = sha512(reviewer.key);
            let objReviewer = new Reviewer(reviewer.id, reviewer.name, hashedKey);
            await ctx.stub.putState(reviewer.id, Buffer.from(JSON.stringify(objReviewer)));
        }

        //submit init articles
        for (const article of seeds.initArticle) {

            let hashedKey = sha512(article.author.key);
            let objAuthor = new Author(article.author.id, article.author.name, hashedKey);

            let objArticle = new Article(article.title, objAuthor, article.coauthor_ids, article.refauthor_ids, article.fee, article.lref);

            let authorTitleIndexKey = await ctx.stub.createCompositeKey(authorTitleIndexName, [article.author.id, article.title]);
            await ctx.stub.putState(authorTitleIndexKey, Buffer.from(JSON.stringify(objArticle)));
        }

        //TODO: start process of reviewing
        //TODO: submit some reviews
    }

    async submittingArticle(ctx, title, author_id, coauthor_ids, ref_author_ids, fee, lref, authorKey){
        console.info("Submitting Article Transaction Invoked");

        // check all inputs
        if(title.length <= 0){
            throw new Error("title must be non-empty string");
        }
        if(author_id.length <= 0){
            throw new Error("author must be non-empty string");
        }
        if(fee.length <= 0){
            throw new Error("fee must be non-empty string");
        } else if(isNaN(fee)){
            throw new Error("fee must be a numeric string");
        }
        if(lref.length <= 0){
            throw new Error("lref must be non-empty string");
        }
        if(authorKey.length <= 0){
            throw new Error("authorKey must be non-empty string");
        }

        // check author
        let authorAsBytes = ctx.stub.getState(author_id);
        if(!authorAsBytes || !authorAsBytes.toString()){
            throw new Error(`Author ${author_id} doesnt exist`);
        }
        let authorjson = {};
        try {
            authorjson = JSON.parse(authorAsBytes.toString());
        } catch (err){
            throw new Error(`Failed to parse Author ${author_id}, err: ${err}`);
        }
        let author = Author.fromJSON(authorjson);

        let hashedKey = sha512(authorKey);
        if(hashedKey !== author.hashedKey){
            console.log(`Invalid author key for Author ${author_id}`);
            return;
        }
        //check coauthors
        for (const coauthorId in coauthor_ids) {
            let coauthorAsByte = ctx.stub.getState(coauthorId);
            if(!coauthorAsByte || !coauthorAsByte.toString()){
                throw new Error(`CoAuthor ${coauthorId} doesnt exist`);
            }
        }
        //check ref_authors
        for (const refauthorId in ref_author_ids) {
            let refauthorAsByte = ctx.stub.getState(refauthorId);
            if(!refauthorAsByte || !refauthorAsByte.toString()){
                throw new Error(`Reference Author ${refauthorId} doesnt exist`);
            }
        }

        //create article
        let article = new Article(title, author, coauthor_ids, ref_author_ids, fee, lref);

        //composite key author - title
        let authorTitleIndexKey = await ctx.stub.createCompositeKey(authorTitleIndexName, [article.author.id, article.title]);

        //check if article exists
        let articleExists = await ctx.stub.getState(authorTitleIndexKey);
        if(Helper.objExists(articleExists)){
            throw new Error(`Article with title ${article.title} from author ${article.author.id} already exists`);
        }

        //save state
        await ctx.stub.putState(authorTitleIndexKey, Buffer.from(JSON.stringify(article)));

        //push event to editors
        let payload = new ArticleSubmittedEvent(article.author.id, article.title);
        ctx.stub.setEvent('article_submitted_event', Buffer.from(JSON.stringify(payload)));
    }

    async startReviewingOfArticle(ctx, editorId, editorKey, title, authorId, reviewerIds){

        if(editorId.length <= 0){
            throw new Error("editorId must be non-empty string");
        }
        if(editorKey.length <= 0){
            throw new Error("editorKey must be non-empty string");
        }
        if(title.length <= 0){
            throw new Error("title must be non-empty string");
        }
        if(authorId.length <= 0){
            throw new Error("authorId must be non-empty string");
        }

        //check if editor is ok - editorKey
        let editorAsBytes = ctx.stub.getState(editorId);
        if(!editorAsBytes || !editorAsBytes.toString()){
            throw new Error(`Editor ${editorId} doesnt exist`);
        }

        let editorjson = {};
        try {
            editorjson = JSON.parse(editorAsBytes.toString());
        } catch (err){
            throw new Error(`Failed to parse Editor ${editorId}, err: ${err}`);
        }
        let editor = Editor.fromJSON(editorjson);

        let hashedKey = sha512(editorKey);
        if(hashedKey !== editor.hashedKey){
            console.log(`Invalid editor key for editor ${editorId}`);
            return;
        }

        //check if article exist
        let authorTitleIndexKey = await ctx.stub.createCompositeKey(authorTitleIndexName, [authorId, title]);

        let articleExists = await ctx.stub.getState(authorTitleIndexKey);
        if(Helper.objExists(articleExists)){
            throw new Error(`Article with title ${article.title} from author ${article.author.id} already exists`);
        }

        //check if reviewing is already in process
        let authorTitleReviewingIndexKey = await ctx.stub.createCompositeKey(authorTitleReviewingIndexName, [authorId, title, "reviewing"]);
        let reviewingExists = await ctx.stub.getState(authorTitleReviewingIndexKey);

        if(Helper.objExists(reviewingExists)){
            throw new Error(`Reviewing for Article with title ${article.title} from author ${article.author.id} already exists`);
        }

        //check all reviewers
        for (const reviewerId in reviewerIds) {
            let reviewerAsByte = ctx.stub.getState(reviewerId);
            if(!reviewerAsByte || !reviewerAsByte.toString()){
                throw new Error(`Reviewer ${reviewerId} doesnt exist`);
            }
        }

        //create object, assign reviewers
        let reviewing = new ReviewingProcess(authorId, title, editor, reviewerIds, [], false, 0);
        await ctx.stub.putState(authorTitleReviewingIndexKey, Buffer.from(JSON.stringify(reviewing)));

        //notify reviewers
        let payload = new DoReviewEvent(authorId, title, reviewerIds);
        ctx.stub.setEvent('do_review_event', Buffer.from(JSON.stringify(payload)));
    }

    async reviewArticle(ctx, reviewerId, reviewerKey, authorId, title, mark, comment){

        //check all inputs
        if(reviewerId.length <= 0){
            throw new Error("reviewerId must be non-empty string");
        }
        if(reviewerKey.length <= 0){
            throw new Error("reviewerKey must be non-empty string");
        }
        if(authorId.length <= 0){
            throw new Error("authorId must be non-empty string");
        }
        if(title.length <= 0){
            throw new Error("title must be non-empty string");
        }
        if(mark.length <= 0){
            throw new Error("mark must be non-empty string");
        } else if(isNaN(mark)){
            throw new Error("mark must be a numeric string");
        }
        if(comment.length <= 0){
            throw new Error("comment must be non-empty string");
        }

        //check reviewer with key
        let reviewerAsBytes = ctx.stub.getState(reviewerId);
        if(!Helper.objExists(reviewerAsBytes)){
            throw new Error(`Reviewer ${reviewerId} doesnt exist`);
        }

        let reviewerJson = {};
        try {
            reviewerJson = JSON.parse(reviewerAsBytes.toString());
        } catch (err){
            throw new Error(`Failed to parse Reviewer ${reviewerId}, err: ${err}`);
        }
        let reviewer = Reviewer.fromJSON(reviewerJson);

        let hashedKey = sha512(reviewerKey);
        if(hashedKey !== editor.hashedKey){
            console.log(`Invalid reviewer key for editor ${reviewerId}`);
            return;
        }

        //check if reviewingProcess exists and if review has right to review that article
        let reviewingProcessQueryString = {};
        reviewingProcessQueryString.selector = {
            docType: ReviewingProcess.getDocType(),
            title: title,
            author_id: authorId,
            isClosed: false,
            reviewer_ids: {
                $elemMatch: {
                    $eq: reviewerId
                }
            },
            $not: {
                reviews: {
                    $elemMatch: {
                        reviewer_id: reviewerId
                    }
                }
            }
        };

        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(reviewingProcessQueryString));
        await Helper.throwErrorIfQueryResultIsNotEmpty(resultIterator, `Review not possible; Reviewer: ${reviewerId}, Title: ${title}, Author: ${authorId}`);

        //get review process from ledger
        reviewingProcessQueryString = {};
        reviewingProcessQueryString.selector = {
            docType: ReviewingProcess.getDocType(),
            title: title,
            author_id: authorId,
            isClosed: false,
            reviewer_ids: {
                $elemMatch: {
                    $eq: reviewerId
                }
            }
        };

        resultIterator = await ctx.stub.getQueryResult(JSON.stringify(reviewingProcessQueryString));
        let reviewProcess = await Helper.onlyOneResultOrThrowError(resultIterator, `Get ReviewProcess Error; Title: ${title}, Author: ${authorId}`);

        //store review
        reviewProcess.saveReview(reviewerId, mark, comment);

        let authorTitleReviewingIndexKey = await ctx.stub.createCompositeKey(authorTitleReviewingIndexName, [authorId, title, "reviewing"]);
        await ctx.stub.putState(authorTitleReviewingIndexKey, Buffer.from(JSON.stringify(reviewProcess)));

        //send event to editor that review is done
        let payload = new ReviewDoneEvent(authorId, title, reviewProcess.editor.id);
        ctx.stub.setEvent('review_done_event', Buffer.from(JSON.stringify(payload)));
    }

    async closeReviewingOfArticle(ctx, editorId, editorKey, authorId, title){
        //check input data
        if(editorId.length <= 0){
            throw new Error("editorId must be non-empty string");
        }
        if(editorKey.length <= 0){
            throw new Error("editorKey must be non-empty string");
        }
        if(authorId.length <= 0){
            throw new Error("authorId must be non-empty string");
        }
        if(title.length <= 0){
            throw new Error("title must be non-empty string");
        }

        //check editor - editorKey
        let editorAsBytes = ctx.stub.getState(editorId);
        if(!editorAsBytes || !editorAsBytes.toString()){
            throw new Error(`Editor ${editorId} doesnt exist`);
        }

        let editorjson = {};
        try {
            editorjson = JSON.parse(editorAsBytes.toString());
        } catch (err){
            throw new Error(`Failed to parse Editor ${editorId}, err: ${err}`);
        }
        let editor = Editor.fromJSON(editorjson);

        let hashedKey = sha512(editorKey);
        if(hashedKey !== editor.hashedKey){
            console.log(`Invalid editor key for editor ${editorId}`);
            return;
        }

        //process exists and its open
        let reviewingProcessQueryString = {};
        reviewingProcessQueryString.selector = {
            docType: ReviewingProcess.getDocType(),
            title: title,
            author_id: authorId,
            isClosed: false,
            editor: {
                id: editorId
            }
        };

        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(reviewingProcessQueryString));
        let reviewProcess = await Helper.onlyOneResultOrThrowError(resultIterator, `Get ReviewProcess Error; Title: ${title}, Author: ${authorId}`);

        //close process and calculate mark
        reviewProcess.closeReviewing();
        reviewProcess.calculateMark();

        //store new state to ledger
        let authorTitleReviewingIndexKey = await ctx.stub.createCompositeKey(authorTitleReviewingIndexName, [authorId, title, "reviewing"]);
        await ctx.stub.putState(authorTitleReviewingIndexKey, Buffer.from(JSON.stringify(reviewProcess)));

        //TODO: split rewards ???
    }

    //TODO: calculate fee for some user ???

    //TODO: registerAuthor, registerReviewer, registerEditor ???

}

module.exports = EurekaContract