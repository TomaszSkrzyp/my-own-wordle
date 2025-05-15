import express from 'express';

import solver from '../solver/mainSolver.js';
/*
Provide a solver hint based on the user’s current game guesses.

Consumes one hint from the session, runs the solver on previous guesses,
and returns JSON with the best next word (`bestWord`) and the count of
remaining possible words (`numberOfWords`).
*/
const router = express.Router();
router.get('/', async (req, res) => {
    console.log("Session ID:", req.sessionID);

    console.log("Session :", req.session);

    const gameState = req.session.gameState;
    if (!gameState.hintAvailable) {
        console.log("shouldnt happen");
        res.json({ message: "No hint available" });
    }
    req.session.gameState.hintAvailable = false;
    const solveResults = solver(gameState.guesses.slice(0, gameState.attempts));
    console.log(solveResults);
    res.json({
        bestWord: solveResults.word,
        numberOfWords: solveResults.number,
    });
}); 
export default router;