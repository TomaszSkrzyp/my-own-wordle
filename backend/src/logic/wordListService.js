
import { loadAllWords } from '../database/wordList/loadWordsFromDB.js';

import { insertWordsToDatabase } from '../database/wordList/loadWordsToDB.js';
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
     if (wordList.length === 0) {
        console.log('Word list empty or not found. Inserting from file...');
        await insertWordsToDatabase();
        wordList = await loadAllWords();
    }
    else{
        console.log("The database is already populated. Moving on with the setup")
    }

    console.log(`Word list loaded with ${wordList.length} entries.`);

    // compute global letter frequencies
    letterFrequencies = computeLetterFrequencies(wordList);

    // sort word list by frequency score
    sortedWordList = sortWordListByLetterFrequency(wordList, letterFrequencies);

    
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

Returns true only if it�s exactly 5 alphabetic characters and exists in `wordList`.
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
