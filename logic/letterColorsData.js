import letterColors from './logic/game.js' // 26 chars (representing the letters a-z)

function getLetterColor(letter) {
    const index = letter.charCodeAt(0) - 'a'.charCodeAt(0);  // 'a' -> 0, 'b' -> 1, ..., 'z' -> 25
    return letterColors[index];
}
function resetLetterColors() {
    letterColors = 'bbbbbbbbbbbbbbbbbbbbbbbbbb';

    

    return ;
}