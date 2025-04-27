function initEmptyGuesses() {
    return Array(6).fill(Array(5).fill(''));

}; 

const initGameState = () => ({
    
  guesses: initEmptyGuesses(),
  attempts: 0,
  gameOver: false,
    letterColors: Array(26).fill('o').join(''), // Initial color (gray)
});

export { initGameState, initEmptyGuesses };