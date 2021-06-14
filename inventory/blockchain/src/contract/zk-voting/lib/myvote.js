'use strict';

/**
 *
 */

class MyVote {

    constructor(electionId, voterId, voteInd) {
        this.electionId = electionId;
        this.voterId = voterId;
        this.vote = Math.pow(2, voteInd);
    }

    static fromJSON(obj){
        if (obj.electionId !== undefined && obj.voterId !== undefined && obj.vote !== undefined){
            return new MyVote(obj.electionId, obj.voterId, obj.vote)
        }
    }
}

module.exports = MyVote;