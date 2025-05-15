/*

Generate an empty 6×5 grid of guesses.

Returns a 2D array with 6 rows and 5 empty strings per row.
*/
function initEmptyGuesses() {
    return Array(6).fill(Array(5).fill(''));

}; 
/*
Create a fresh game state object.

Includes:
- `guesses`: empty grid,
- `attempts`: number of guesses used,
- `gameOver`: whether the game has ended,
- `hintAvailable`: whether a solver hint can be requested,
- `letterColors`: initial grey state for all letters.
*/
const initGameState = () => ({
    
  guesses: initEmptyGuesses(),
  attempts: 0,
    gameOver: false,
    hintAvailable: true,
    letterColors: Array(26).fill('o').join(''), // Initial color (gray)
});

export { initGameState, initEmptyGuesses };