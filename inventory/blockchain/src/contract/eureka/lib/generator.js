'use strict';

const fs = require('fs');
const read = require('read-yaml');
const RandExp = require('randexp');

const Utils = require('./utils');


const parameters = read.sync('seedParameters.yaml');

let authors = [];
let reviewers = [];
let editors = [];
let initArticle = [];
let newArticles = [];
let initReviewingProcess = [];
let initReviews = [];
let newReviews = [];

const authorUserType = 'A';
const reviewerUserType = 'R';
const editorUserType = 'E';
function generateUser(type, index){

    let id = type + Utils.generateRandomString(parameters.id_length) + index;
    let key = Utils.generateRandomString(parameters.key_length);
    let name = type + ": " + parameters.names[Utils.getRandomInt(parameters.names.length)];

    return {
        id: id,
        name: name,
        key: key
    };
}

function takeRandomFromList(list, number, rootElement){
    let take = Utils.getRandomInt(number);

    let returnList = [...list];
    const ind = returnList.indexOf(rootElement);
    if(ind > -1){
        returnList.splice(ind, 1);
    }

    return Utils.getRandomSubarray(returnList, take);
}

function generateArticle(index, flag){

    let title = flag + index + " " + Utils.generateRandomWord(10);
    let author = authors[Utils.getRandomInt(authors.length)];
    let coauthor_ids = takeRandomFromList(authors, parameters.max_coauthors, author);
    let refauthor_ids = takeRandomFromList(authors, parameters.max_ref_authors, author);
    let fee = Utils.getRandomInt(1000);
    let lref = Utils.generateRandomString(512);

    return {
        title: title,
        author: author,
        coauthor_ids: coauthor_ids,
        refauthor_ids: refauthor_ids,
        fee: fee,
        lref: lref
    }
}

for (let i = 0; i < parameters.authors; i++){
    authors.push(generateUser(authorUserType, i));
}

for (let i = 0; i < parameters.reviewers; i++){
    reviewers.push(generateUser(reviewerUserType, i));
}

for (let i = 0; i < parameters.editors; i++){
    editors.push(generateUser(editorUserType, i));
}

for (let i = 0; i < parameters.init_articles; i++){
    initArticle.push(generateArticle(i, "I"));
}

const json = JSON.stringify({
    authors: authors,
    reviewers: reviewers,
    editors: editors,
    initArticle: initArticle
}, null, 4);

fs.writeFile('seeds.json', json, function(err) {
    if (err) {
        console.log(err);
    }
});

//console.log("=============================== Generate seeds.json done");
