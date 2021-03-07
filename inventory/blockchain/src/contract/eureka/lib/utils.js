'use strict';

const RandExp = require('randexp');

class Utils {

    static generateRandomString(len) {
        return new RandExp('.{'+ len +'}').gen();
    }

    static generateRandomWord(len) {
        return new RandExp('[A-Z][a-z]{'+ (len - 1) +'}').gen();
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    
}

module.exports = Utils;