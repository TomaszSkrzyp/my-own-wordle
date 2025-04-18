import express from 'express'; 
import retrieveTodays from '../database/thisDayWord.js';
import { checkWord, letterColors,resetLetterColors,letterColorsGreen } from '../logic/game.js';

import { isValidWord } from '../logic/wordService.js';
import initGameState from '../logic/initGameState.js';

const router = express.Router();


// Endpoint to reset the game
router.post('/reset', (req, res) => {
  req.session.gameState = initGameState();
  res.status(200).json({ message: 'Game state reset' });
});


router.get('/state', (req, res) => {
  if (!req.session.gameState) {
    req.session.gameState = initGameState();
  }
  res.json(req.session.gameState);
});



router.post('/check', async (req, res) => {
   const { guess } = req.body;
  if (!guess) {
    return res.status(400).json({ error: 'Missing guess' });
  }

  if (!req.session.gameState) {
    return res.status(400).json({ error: 'Game not initialized' });
  }

  const gameState = req.session.gameState;
  const { guesses, attempts,oldLetterColors } = gameState;

  console.log('Current session game state:', req.session.gameState);

  try {
    const isValid = await isValidWord(guess);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid word' });
    }

    const todayWord = await retrieveTodays();
    const result = await checkWord(guess, todayWord);

    // Update game state
    const colorEnum = { g: 'green', b: 'gray', y: 'yellow' };
    const updatedGuesses = [...guesses];
    updatedGuesses[attempts] = updatedGuesses[attempts].map((letter, index) => ({
      letter:guess[index],
      color:  colorEnum[result[index]],
      flipped: true,
    }));
    console.log(updatedGuesses);
    gameState.guesses = updatedGuesses;
    gameState.attempts = attempts + 1;

    if (result === 'ggggg') {
        letterColorsGreen();
      gameState.gameOver = true;
    }

    req.session.gameState = gameState;

    res.json({
      result,
      updatedLetterColors: letterColors,
      gameState,
    })
    console.log(gameState);
  } catch (error) {
    console.error('Error checking word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;