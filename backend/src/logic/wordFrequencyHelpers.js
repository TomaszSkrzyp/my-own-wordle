// Helper: Compute letter frequency

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

// Helper: Sort words based on frequency score
function sortWordListByLetterFrequency(wordList, letterFrequencies) {
    return wordList.slice().sort((a, b) => {
        const score = word => [...new Set(word)].reduce((sum, l) => sum + (letterFrequencies[l] || 0), 0);
        return score(b) - score(a);
    });
}

export {   computeLetterFrequencies, sortWordListByLetterFrequency };