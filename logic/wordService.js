
import { loadAllWords } from '../database/loadWords.js';

let wordList = [];

async function initWordList() {
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
    const isInWordList = wordList.includes(word.toLowerCase());
    console.log(isFiveLetterWord);

    // Return true if both conditions are satisfied
    return isFiveLetterWord && isInWordList;
}


export { initWordList, getWordList, isValidWord };
