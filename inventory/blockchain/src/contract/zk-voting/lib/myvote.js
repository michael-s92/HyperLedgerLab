'use strict';

/**
 *
 */

class MyVote {

    constructor(electionId, voterId, voteInd) {
        this.electionId = electionId;
        this.voterId = voterId;
        // voteInd is the index of the candidat in the list of all candidats
        // since we dont want to give anybody the order of the list, we also dont want to store the index
        // so we are using function to create vote value
        // and we now how to reverse the function to get the vote when we need, but just inside chaincode withour revealing any data
        this.vote = Math.pow(2, voteInd);
    }

    static fromJSON(obj){
        if (obj.electionId !== undefined && obj.voterId !== undefined && obj.vote !== undefined){
            return new MyVote(obj.electionId, obj.voterId, obj.vote)
        }
    }
}

module.exports = MyVote;