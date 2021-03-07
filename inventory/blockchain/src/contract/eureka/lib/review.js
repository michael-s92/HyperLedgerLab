'use strict';

/**
 *
 */

const docType = "doc-review";

class Review {

    constructor(reviewer_id, mark, comment) {
        this.docType = docType;
        this.reviewer_id = reviewer_id;
        this.mark = mark;
        this.comment = comment;
    }

    static fromJSON(obj){
        if (obj.reviewer_id !== undefined && obj.mark !== undefined && obj.comment !== undefined){
            return new Review(obj.reviewer_id, obj.mark, obj.comment)
        }
    }
}

module.exports = Review;