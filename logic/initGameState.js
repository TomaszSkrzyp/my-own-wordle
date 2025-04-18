const initGameState = () => ({
  guesses: Array(6).fill(Array(5).fill('')),
  attempts: 0,
  gameOver: false,
  letterColors: Array(26).fill('b'), // Initial color (gray)
});

export default initGameState;