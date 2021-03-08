'use strict';

/**
 *
 */

class ChaincodeEvent {

    constructor(author_id, title) {
        this.author_id = author_id;
        this.title = title;
    }
}

class ArticleSubmittedEvent extends ChaincodeEvent{

    constructor(author_id, title) {
        super(author_id, title);
    }

}

class DoReviewEvent extends ChaincodeEvent{

    constructor(author_id, title, reviewerIds) {
        super(author_id, title);
        this.reviewerIds = reviewerIds;
    }

}

class ReviewDoneEvent extends ChaincodeEvent{

    constructor(author_id, title, editor_id) {
        super(author_id, title);
        this.editor_id = editor_id;
    }

}

module.exports = { ArticleSubmittedEvent, DoReviewEvent, ReviewDoneEvent };