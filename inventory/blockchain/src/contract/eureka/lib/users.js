'use strict';

/**
 *
 */

class User {

    constructor(docType, id, name, hashedKey) {
        this.docType = docType;
        this.id = id;
        this.name = name;
        this.hashedKey = hashedKey;
    }
}

class Author extends User{

    constructor(id, name, hashedKey) {
        let docType = "doc-author";
        super(docType, id, name, hashedKey);
    }

    static fromJSON(obj){
        if (obj.id !== undefined && obj.name !== undefined && obj.hashedKey !== undefined){
            return new Author(obj.id, obj.name, obj.hashedKey)
        }
    }
}

class Editor extends User{

    constructor(id, name, hashedKey) {
        let docType = "doc-editor";
        super(docType, id, name, hashedKey);
    }

    static fromJSON(obj){
        if (obj.id !== undefined && obj.name !== undefined && obj.hashedKey !== undefined){
            return new Editor(obj.id, obj.name, obj.hashedKey)
        }
    }
}

class Reviewer extends User{

    constructor(id, name, hashedKey) {
        let docType = "doc-reviewer";
        super(docType, id, name, hashedKey);
    }

    static fromJSON(obj){
        if (obj.id !== undefined && obj.name !== undefined && obj.hashedKey !== undefined){
            return new Reviewer(obj.id, obj.name, obj.hashedKey)
        }
    }
}

module.exports = { Author, Editor, Reviewer };