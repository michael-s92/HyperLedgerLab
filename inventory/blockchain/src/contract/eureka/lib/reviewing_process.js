'use strict';

/**
 *
 */

const { Editor } = require('./users');
const Review = require('./review');

const docType = 'reviewing-process-doc';

class ReviewingProcess {

    constructor(author_id, title, editor, reviewer_ids, reviews, isClosed, mark) {
        this.docType = docType;
        this.author_id = author_id;
        this.title = title;
        this.editor = editor;
        this.reviewer_ids = (reviewer_ids === undefined) ? [] : reviewer_ids;
        this.reviews = (reviews === undefined) ? [] : reviews;
        this.isClosed = (isClosed === undefined) ? false : isClosed;
        this.mark = (mark === undefined) ? 0 : mark;
    }

    saveReview(reviewerId, mark, comment){
        this.reviews.push(new Review(reviewerId, mark, comment));
    }

    closeReviewing(){
        this.isClosed = true;
    }

    calculateMark(){
        let sum = 0;
        for (const review in this.reviews) {
            sum += review.mark;
        }

        this.mark = sum / this.reviews.length;
    }

    static getDocType(){
        return docType;
    }

    static fromJSON(obj){

        if(obj.author_id !== undefined && obj.title !== undefined){

            let editor = Editor.fromJSON(obj.editor);
            if(editor !== undefined) {
                let reviewObjs = [];
                for (const review in obj.reviews) {
                    let tmp = Review.fromJSON(review);
                    if(tmp !== undefined){
                        reviewObjs.push(tmp);
                    }
                }

                return new ReviewingProcess(obj.author_id, obj.title, editor, obj.reviewer_id, reviewObjs, obj.isClosed, obj.mark);
            }
        }
    }
}

module.exports = ReviewingProcess;