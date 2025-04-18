import express from 'express'; 
import retrieveTodays from '../database/thisDayWord.js';
import { checkWord, letterColors } from '../logic/game.js';
import { isValidWord } from '../logic/wordService.js';

const router = express.Router();





router.post('/check', async (req, res) => {
    const { guess } = req.body;

    if (!guess) {
        return res.status(400).json({ error: "Missing guess" });
    }

    try {
        const isValid = await isValidWord(guess);

        if (!isValid) {
            return res.status(400).json({ error: "Invalid word" });
        }

        const todayWord = await retrieveTodays();
        const result = checkWord(guess, todayWord); // result = [{ letter: 'a', color: 'green' }, ...]

        //update

        

        res.json({
            result,
            updatedLetterColors: letterColors
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




export default router;
