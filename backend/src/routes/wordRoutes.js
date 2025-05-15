import express from 'express';

import retrieveTodays from '../database/wordleWord/wordRetrieval.js';
import { checkWord,letterColorsGreen } from '../logic/game.js';
import { isValidWord } from '../logic/wordListService.js';
import { initGameState } from '../logic/initGameState.js';
import getStateFromDB from '../database/gameStates/loadGame.js';
import saveStateToDB from '../database/gameStates/writeGame.js';

import { recordGameWon } from '../database/user/userStats.js';


import isToday from '../database/gameStates/isToday.js';

const router = express.Router();

/*
Reset the in?session game state to a fresh new game.

Clears any existing guesses and flags, returning a confirmation message.
*/
router.post('/reset', (req, res) => {
    req.session.gameState = initGameState();
    res.status(200).json({
        message: 'Game state reset',
    });
});
/*

Load or initialize the current game state for a user or guest.

If the user is logged in and has a saved state updated today, load it;
otherwise initialize a new state. For guests, always start fresh.
Returns JSON with `loggedIn` and the `gameState`
*/
router.get('/state', async (req, res) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session :", req.session);

    if (!req.session.allowedToContinue) {
        console.log("Go back home");
        return res.status(403).json({ error: 'Access denied' });
    }
    // Logged-in user: try to load saved game state
    if (req.session.user && req.session.user.userId) {
            console.log("User is logged in — trying to load saved state");

            try {
                const savedGameState = await getStateFromDB(req.session.user.userId);
                if (savedGameState.data && isToday(new Date(savedGameState.updated_at))) {
                    
                    console.log("Found saved game state, loading into session");
                    
                    req.session.gameState = savedGameState.data;
                } else {
                    console.log("No saved game state found — initializing new one");
                    req.session.gameState = initGameState();
                }
            } catch (error) {
                console.error("Error loading game state from DB:", error);
                req.session.gameState = initGameState();
            }

        } else {
            // Guest user — start fresh
            
            if (!req.session.gameState) {
                console.log("Guest user — initializing new game state");
                req.session.gameState = initGameState();
            }
        }
    
    res.status(200).json({
        loggedIn: !!req.session.user,
        gameState: req.session.gameState
    });
});

/*

Process a user's guess: validate, compare to today’s word, update state, and save.

Checks word validity, runs feedback logic, updates attempts and colors,
marks game over or win, persists to DB for logged?in users, and returns
the feedback and updated gameState.
*/
router.post('/check', async (req, res) => {
    console.log("Session ID:", req.sessionID);

    console.log("Session :", req.session);
    const { guess } = req.body;
    if (!guess || req.session.gameOver) {
        return res.status(400).json({ error: 'Missing guess' });
    }

    if (!req.session.gameState) {
        return res.status(400).json({ error: 'Game not initialized' });
    }

    const gameState = req.session.gameState;
    const { guesses, attempts } = gameState;
    console.log("GUESSES");
    console.log(guesses);
    try {
        const isValid =  isValidWord(guess);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid word' });
        }

        const todayWord = await retrieveTodays();
        console.log(todayWord);


        const result = await checkWord(guess, todayWord, gameState.letterColors);
        console.log(result);
        // Update guesses
        const updatedGuesses = [...guesses];
        updatedGuesses[attempts] = updatedGuesses[attempts].map((_, index) => ({
            letter: guess[index],
            color: result.feedback[index],
            flipped: true,
        }));
        if (result.feedback === 'ggggg' || attempts+1==6) {
            gameState.gameOver = true;
            if (result.feedback === 'ggggg') {
                console.log("LOGGED IN");
                console.log(!!req.session.user);
                if (!!req.session.user) {
                    recordGameWon(req.session.user.userId, req.session.user.gamesWon);
                }
                result.letterColors = letterColorsGreen();
            }
        }


        gameState.guesses = updatedGuesses;
        gameState.attempts = attempts + 1;
        gameState.letterColors = result.letterColors;
        req.session.gameState = gameState;

        if(req.session.user && req.session.user.userId) {
            await saveStateToDB(req.session.user.userId, gameState);
        }
        res.json({
            result:result.feedback,
            gameState,
        });

    } catch (error) {
        console.error('Error checking word:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
