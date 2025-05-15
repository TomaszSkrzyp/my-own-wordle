
import { loadAllWords } from '../database/wordList/loadWordsFromDB.js';
import {  computeLetterFrequencies, sortWordListByLetterFrequency } from './wordFrequencyHelpers.js';

let sortedWordList = [];
let letterFrequencies = {};
let wordList = [];
/*
Load all valid words and build frequency-sorted lists.

Populates `wordList`, computes letter frequencies, then creates
`sortedWordList` for solver recommendation.
*/
async function initWordList() {
    console.log("Start loading word list...");
    wordList = await loadAllWords();

    console.log(`Word list loaded with ${wordList.length} entries.`);

    // compute global letter frequencies
    letterFrequencies = computeLetterFrequencies(wordList);

    // sort word list by frequency score
    sortedWordList = sortWordListByLetterFrequency(wordList, letterFrequencies);

    console.log("Word list sorted by letter frequency.");
    console.log(sortedWordList[0]);
    
}
/*
Get the raw list of valid words.
*/
function getWordList() {
    return wordList;
}
/*
Get the letter-frequency-sorted list of words.
*/
function getSortedWordList() {
    return sortedWordList;
}
/*

Check if a given word is valid (5 letters & in the loaded list).

Returns true only if it’s exactly 5 alphabetic characters and exists in `wordList`.
*/
function isValidWord(word) {
    // check if the word is 5-letter long 
    const isFiveLetterWord = /^[a-zA-Z]{5}$/.test(word);
    console.log(isFiveLetterWord);
    // Check if the word exists in the wordList
    
    const isInWordList =getWordList().includes(word.toLowerCase());
   

    return isFiveLetterWord && isInWordList;
}


export { initWordList, getWordList,getSortedWordList, isValidWord };
