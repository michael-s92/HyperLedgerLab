'use strict';

/**
 *
 */
const { Author } = require('./users');

const docType = "doc-article";

class Article {

    constructor(title, author, coauthor_ids, ref_author_ids, fee, lref) {
        this.docType = docType;
        this.title = title;
        this.author = author;
        this.coauthor_ids = (coauthor_ids === undefined) ? [] : coauthor_ids;
        this.ref_author_ids = (ref_author_ids === undefined) ? [] : ref_author_ids;
        this.fee = fee;
        this.lref = lref;
    }
    static fromJSON(obj) {
        if (obj.title !== undefined && obj.coauthor_ids !== undefined && obj.ref_author_ids !== undefined
            && obj.fee !== undefined && obj.lref !== undefined) {

            let author = Author.fromJSON(obj.author);
            if(author !== undefined){
                return new Article(obj.title, author, obj.coauthor_ids, obj.ref_author_ids, obj.fee, obj.lref);
            }
        }
    }

}

module.exports = Article;