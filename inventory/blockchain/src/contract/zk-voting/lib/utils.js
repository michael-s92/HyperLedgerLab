'use strict';

const RandExp = require('randexp');

class Utils {

    static generateRandomKey(len) {
        return new RandExp('[a-zA-Z].{'+ (len - 1) +'}').gen();
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
    
    static getRandomSentence(words){
        let sentence = "";

        for(let i = 0; i < words; i++){
            let len = this.getRandomInt(50);
            sentence += this.generateRandomWord(len) + " ";
        }
        return sentence;
    }

    static getRandomArrayOfStrings(len){
        
        let result = [];
        for(let i = 0; i < len; i++) {
            let tmp = "C" + i + ": " + this.generateRandomWord(10);
            result.push(tmp);
        }

        return result;
    }

    static shuffle(inArray) {
        let array = inArray;
        var currentIndex = array.length,  randomIndex;
      
        while (0 !== currentIndex) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}

module.exports = Utils;