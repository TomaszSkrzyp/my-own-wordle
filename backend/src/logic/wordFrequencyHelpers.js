/*
Compute how frequently each letter appears across all words.

Counts each unique letter in each word once, returning a map
of letter -> count.
*/


function computeLetterFrequencies(wordList) {
    const freq = {};
    for (const word of wordList) {
        const uniqueLetters = new Set(word);
        for (const letter of uniqueLetters) {
            freq[letter] = (freq[letter] || 0) + 1;
        }
    }
    return freq;
}
/*

Sort a list of words by their total letter frequency score.

Higher-scoring words (with common letters) come first.
*/
function sortWordListByLetterFrequency(wordList, letterFrequencies) {
    return wordList.slice().sort((a, b) => {
        const score = word => [...new Set(word)].reduce((sum, l) => sum + (letterFrequencies[l] || 0), 0);
        return score(b) - score(a);
    });
}

export {   computeLetterFrequencies, sortWordListByLetterFrequency };