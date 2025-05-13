import express from 'express';

import solver from '../solver/mainSolver.js';

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