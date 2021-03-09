'use strict';

const RandExp = require('randexp');

class Utils {
   
    static generateRandomString(len) {
        return new RandExp('.{'+ len +'}').gen();
    }

    static generateRandomLetters(len) {
        return new RandExp('[a-zA-Z]{'+ len +'}').gen();
    }

    // expected output: 0, ..., (max - 1)
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
      
    static getRandomPercent(){
        return this.getRandomInt(101);
    }
}

module.exports = Utils;