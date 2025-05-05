
import { loadAllWords } from '../database/wordList/loadWordsFromDB.js';
import {  computeLetterFrequencies, sortWordListByLetterFrequency } from './wordFrequencyHelpers.js';

let sortedWordList = [];
let letterFrequencies = {};
let wordList = [];

async function initWordList() {
    console.log("Start loading word list...");
    wordList = await loadAllWords();

    console.log(`Word list loaded with ${wordList.length} entries.`);

    // compute global letter frequencies
    letterFrequencies = computeLetterFrequencies(wordList);

    // sort word list by frequency score
    sortedWordList = sortWordListByLetterFrequency(wordList, letterFrequencies);

    console.log("Word list sorted by letter frequency.");
    for (let i = 0; i < 100; i++) {
        console.log(sortedWordList[i]);
    }
}

function getWordList() {
    return wordList;
}
function getSortedWordList() {
    return sortedWordList;
}

function isValidWord(word) {
    // check if the word is 5-letter long 
    const isFiveLetterWord = /^[a-zA-Z]{5}$/.test(word);
    console.log(isFiveLetterWord);
    // Check if the word exists in the wordList
    
    const isInWordList =getWordList().includes(word.toLowerCase());
   

    return isFiveLetterWord && isInWordList;
}


export { initWordList, getWordList,getSortedWordList, isValidWord };
