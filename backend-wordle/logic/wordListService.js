
import { loadAllWords } from '../database/loadWords.js';

let wordList = [];

async function initWordList() {
    console.log("start");
    wordList = await loadAllWords();
    console.log(`Word list loaded with ${wordList.length} entries.`);
}

function getWordList() {
    return wordList;
}

function isValidWord(word) {

    const isFiveLetterWord = /^[a-zA-Z]{5}$/.test(word);
    console.log(isFiveLetterWord);
    // Check if the word exists in the wordList
    
    const isInWordList =getWordList().includes(word.toLowerCase());
   

    // Return true if both conditions are satisfied
    return isFiveLetterWord && isInWordList;
}


export { initWordList, getWordList, isValidWord };
