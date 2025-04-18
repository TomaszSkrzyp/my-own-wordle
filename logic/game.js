let letterColors = 'bbbbbbbbbbbbbbbbbbbbbbbbbb'
function checkWord(guess, answer) {
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

            letterColorsArray[guess[i].charCodeAt(0) - 'a'.charCodeAt(0)] = 'y';
        } else if (feedback[i] !== 'g') {
            feedback[i] = 'b'; 
        }
    }
    letterColors = letterColorsArray.join('');
    return feedback.join('');  
}

export { checkWord, letterColors };
