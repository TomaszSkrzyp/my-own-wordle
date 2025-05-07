import express from 'express';

import { recordGameStarted } from '../database/user/userStats.js';
const router = express.Router();

router.get('/data', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    
    const { username, userId, gamesPlayed, gamesWon, lastPlayedDate } = req.session.user;
    console.log({ username, userId, gamesPlayed, gamesWon, lastPlayedDate  });
    res.json({ username, userId, gamesPlayed, gamesWon, lastPlayedDate });
});

router.post('/startNew', async (req, res) => {
    try {
        const { username, userId, gamesPlayed,gamesWon } = req.session.user;

        const result = await recordGameStarted(userId, gamesPlayed);

        if (result.success) {
            req.session.user.gamesPlayed = result.gamesPlayed;

            return res.json({
                message: 'Games played incremented successfully.',
                userData: { username, userId, gamesPlayed, gamesWon }
            });
        } else {
            return res.status(500).json({ error: 'Failed to increment games played.' });
        }
    } catch (error) {
        console.error('Error in /startNew:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

export default router;