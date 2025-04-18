let letterColors=Array(26).fill('b').join('');
async function checkWord(guess, answer) {
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
    console.log("PRRRRRRR");
    console.log(letterColors);
    return feedback.join('');  
}
function resetLetterColors() {
    letterColors=Array(26).fill('b').join('')
    console.log("colors:");
    console.log(letterColors);
    

    return ;
}
function letterColorsGreen() {
    letterColors=Array(26).fill('g').join('');
    console.log("colors:");
    console.log(letterColors);
    

    return ;
}
export { checkWord, letterColors,resetLetterColors,letterColorsGreen };
