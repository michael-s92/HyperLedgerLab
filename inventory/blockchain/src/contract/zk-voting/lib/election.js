'use strict';

const Utils = require('./utils');

const docType = "election-doc";

class Election {

    constructor(id, candidates, votes, isClosed) {
        this.docType = docType;
        this.id = id;
        this.candidates = (candidates === undefined) ? [] : candidates;
        this.votes = (votes === undefined) ? [] : votes;
        this.isClosed = (isClosed === undefined) ? false : votes;
    }

    static fromJSON(obj) {
        if (obj.id !== undefined && obj.candidates !== undefined && obj.votes !== undefined) {
            return new Election(obj.id, obj.candidates, obj.votes, obj.isClosed);
        }
    }

    close() {
        this.isClosed = true;
    }

    getCandidates() {
        return Utils.shuffle(this.candidates);
    }

    storeVote(myvote) {

        let ind = this.votes.findIndex(v => v.voterId === myvote.voterId);
        if (ind !== -1) {
            this.votes.push(myvote);
        }
    }

    // x power on something gives y
    static getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }

    getResults(){

        let results = {};

        this.votes.forEach(v => {
            
            let ind = getBaseLog(2, v.vote);
            let cand = this.candidates[ind];

            if(cand !== undefined){

                let vkey = results.get(cand);
                if(vkey === undefined){

                    results.set(cand, 1);
                } else {

                    results.set(cand, vkey + 1);
                }
            }
        });


        return results;
    }

    hasVoted(voterId){

        return this.votes.findIndex(v => voterId === v.voterId) !== -1;
    }

    voteOK(voterId){

        return this.votes.findIndex(v => voterId === v.voterId) !== -1;
    }

}

module.exports = Election;