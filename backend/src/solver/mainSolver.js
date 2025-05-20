import { getSortedWordList } from '../logic/wordListService.js'
/*
Filter a list of words by green, yellow, and black letter constraints.

`greens` maps letters to positions they must occupy; `yellows` maps letters
to positions they must avoid but appear elsewhere; `blacks` is a set of
letters that must not appear.
*/
function findViableWords(greens, yellows, blacks, wordList = getSortedWordList()) {
    return wordList.filter(word => {
        //check green letters
        for (const letter in greens) {
            for (const pos of greens[letter]) {
                if (word[pos] !== letter) return false;
            }
        }

        // check yellow letters
        for (const letter in yellows) {
            if (!word.includes(letter)) return false;
            for (const pos of yellows[letter]) {
                if (word[pos] === letter) return false;
            }
        }

        // check black letters: must NOT be anywhere in the word
        for (let i = 0; i < word.length; i++) {
            if (blacks.has(word[i])) return false;
        }
       
        return true;
    });
}
/*
Derive letter rules from past guess tiles.

Scans each guess row to build:
- `greenLetters`: exact matches,
- `yellowLetters`: present but wrong position,
- `blackLetters`: absent letters.
*/
function findLetterRules(guesses) {
    const greens = {};
    const yellows = {};
    const blacks = new Set();

    for (let row of guesses) {
        const seenGreenOrYellow = new Set();

        for (let i = 0; i < row.length; i++) {
            const tile = row[i];
            const letter = tile.letter;

            if (tile.color === 'g') {
                if (!greens[letter]) greens[letter] = [];
                greens[letter].push(i);
                seenGreenOrYellow.add(letter);
            } else if (tile.color === 'y') {
                if (!yellows[letter]) yellows[letter] = new Set();
                yellows[letter].add(i);
                seenGreenOrYellow.add(letter);
            }
        }

        for (let i = 0; i < row.length; i++) {
            const tile = row[i];
            const letter = tile.letter;
            if (tile.color === 'b' && !seenGreenOrYellow.has(letter)) {
                blacks.add(letter);
            }
        }
    }

    return {
        greenLetters: greens,
        yellowLetters: yellows,
        blackLetters: blacks
    };
}
/*
Suggest the next best guess using the current game�s guess history.

Combines letter rules and viable-word filtering to return the top candidate
and the total number of possibilities remaining.
*/
function solver(guesses) {
    const { greenLetters, yellowLetters, blackLetters } = findLetterRules(guesses);
    const possibleWordList = findViableWords(greenLetters, yellowLetters, blackLetters);
  
    return { word: possibleWordList[0], number: possibleWordList.length};
}
export default solver;