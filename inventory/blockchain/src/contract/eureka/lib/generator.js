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

for (let i = 0; i < parameters.authors; i++){
    authors.push(generateUser(authorUserType, i));
}

for (let i = 0; i < parameters.reviewers; i++){
    reviewers.push(generateUser(reviewerUserType, i));
}

for (let i = 0; i < parameters.editors; i++){
    editors.push(generateUser(editorUserType, i));
}

const json = JSON.stringify({
    authors: authors,
    reviewers: reviewers,
    editors: editors
}, null, 4);

fs.writeFile('seeds.json', json, function(err) {
    if (err) {
        console.log(err);
    }
});

//console.log("=============================== Generate seeds.json done");
