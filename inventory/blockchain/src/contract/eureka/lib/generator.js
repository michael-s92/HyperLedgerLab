'use strict';

const fs = require('fs');
const read = require('read-yaml');
const RandExp = require('randexp');

const Utils = require('./utils');
const { title } = require('process');


const parameters = read.sync('seedParameters.yaml');

let authors = [];
let reviewers = [];
let editors = [];
let initArticle = [];
let openReviewingProcess = [];
let newArticles = [];
let defaultReview = [];

const authorUserType = 'A';
const reviewerUserType = 'R';
const editorUserType = 'E';
function generateUser(type, index) {

    let id = type + Utils.generateRandomWord(parameters.id_length) + index;
    let key = Utils.generateRandomString(parameters.key_length);
    let name = type + ": " + parameters.names[Utils.getRandomInt(parameters.names.length)];

    return {
        id: id,
        name: name,
        key: key
    };
}

function takeRandomFromList(list, number, rootElement) {
    let take = Utils.getRandomInt(number - 1) + 1;

    let returnList = [...list];
    if (rootElement !== undefined) {
        const ind = returnList.indexOf(rootElement);
        if (ind > -1) {
            returnList.splice(ind, 1);
        }
    }

    return Utils.getRandomSubarray(returnList, take);
}

function generateArticle(index, flag) {

    let title = flag + index + " " + Utils.generateRandomWord(10);
    let author = authors[Utils.getRandomInt(authors.length)];
    let coauthor_ids = takeRandomFromList(authors, parameters.max_coauthors, author).map(e => e.id);
    let refauthor_ids = takeRandomFromList(authors, parameters.max_ref_authors, author).map(e => e.id);
    let fee = Utils.getRandomInt(1000).toString();
    let lref = Utils.generateRandomString(512);

    return {
        title: title,
        author: author,
        coauthor_ids: coauthor_ids,
        refauthor_ids: refauthor_ids,
        fee: fee,
        lref: lref
    };
}

function generateReviewingProcess(index, article) {
   
    let editor = editors[Utils.getRandomInt(editors.length)];
    let reviewersSample = takeRandomFromList(reviewers, parameters.max_reviewers);

    return {
        title: article.title,
        author_id: article.author.id,
        editor: editor,
        reviewers: reviewersSample
    };
}

function generateDefaultReview(index){

    let mark = Utils.getRandomInt(10).toString();
    let comment = Utils.getRandomSentence(5);

    return{
        mark: mark,
        comment: comment
    };
}

for (let i = 0; i < parameters.authors; i++) {
    authors.push(generateUser(authorUserType, i));
}

for (let i = 0; i < parameters.reviewers; i++) {
    reviewers.push(generateUser(reviewerUserType, i));
}

for (let i = 0; i < parameters.editors; i++) {
    editors.push(generateUser(editorUserType, i));
}

for (let i = 0; i < parameters.init_articles; i++) {
    initArticle.push(generateArticle(i, "I"));
}

for (let i = 0; i < parameters.new_articles; i++) {
    newArticles.push(generateArticle(i, "B"));
}

for (let i = 0; i < parameters.init_open_reviewings; i++) {

    let articleForProcess = generateArticle(i, "R");
    initArticle.push(articleForProcess);

    openReviewingProcess.push(generateReviewingProcess(i, articleForProcess));
}

for (let i = 0; i < parameters.default_reviews; i++) {
    defaultReview.push(generateDefaultReview(i));
}

const json = JSON.stringify({
    authors: authors,
    reviewers: reviewers,
    editors: editors,
    initArticle: initArticle,
    openReviewingProcess: openReviewingProcess,
    newArticles: newArticles,
    defaultReview: defaultReview
}, null, 4);

fs.writeFile('seeds.json', json, function (err) {
    if (err) {
        console.log(err);
    }
});

//console.log("=============================== Generate seeds.json done");
