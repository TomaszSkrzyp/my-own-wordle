
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
function letterColorsGrey() {
    let letterColors=Array(26).fill('o').join('')
    console.log("colors:");
    console.log(letterColors);
    

    return letterColors ;
}
function letterColorsGreen() {
    let letterColors=Array(26).fill('g').join('');
    console.log("colors:");
    console.log(letterColors);
    

    return letterColors ;
}
export { checkWord, letterColorsGrey,letterColorsGreen };
