/*
Compare a user's guess against the answer and update letter colors.

Returns:
- 'feedback': a 5-char string of 'g', 'y', or 'b' for each letter.
- 'letterColors': updated 26-char string tracking best known color for each alphabet letter.
Uses a two-pass algorithm: first mark greens, then mark yellows/blacks.
*/
async function checkWord(guess, answer,letterColors) {
    let feedback = [];
    let answerCopy = [...answer];  
    let letterColorsArray = letterColors.split('');
    for (let i = 0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            feedback[i] = 'g';  
            answerCopy[i] = null;  
            letterColorsArray[guess[i].charCodeAt(0) - 'a'.charCodeAt(0)] = 'g';
           
        }
        
    }

    for (let i = 0; i < 5; i++) {
        if (feedback[i] !== 'g' && answerCopy.includes(guess[i])) {

            feedback[i] = 'y';
            answerCopy[answerCopy.indexOf(guess[i])] = null;
            if (letterColorsArray[guess[i].charCodeAt(0) - 'a'.charCodeAt(0)] != 'g') {
                

                letterColorsArray[guess[i].charCodeAt(0) - 'a'.charCodeAt(0)] = 'y';
            }
        } else if (feedback[i] !== 'g') {
            feedback[i] = 'b'; 

            letterColorsArray[guess[i].charCodeAt(0) - 'a'.charCodeAt(0)] = 'b';
        }
    }
    letterColors = letterColorsArray.join('');
    return { feedback: feedback.join(''), letterColors: letterColors }
}
/*
Initialize all letter colors to grey.

Creates a 26-char string of'o'(grey), indicating no letters have been tried yet.
*/
function letterColorsGrey() {
    let letterColors=Array(26).fill('o').join('')
    console.log("colors:");
    console.log(letterColors);
    

    return letterColors ;
}
/*
Initialize all letter colors to green.

Creates a 26-char string of'g'(green), indicating a won game.
*/
function letterColorsGreen() {
    let letterColors=Array(26).fill('g').join('');
    console.log("colors:");
    console.log(letterColors);
    

    return letterColors ;
}
export { checkWord, letterColorsGrey,letterColorsGreen };
