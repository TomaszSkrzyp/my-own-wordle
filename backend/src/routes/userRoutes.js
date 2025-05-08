import express from 'express';

import { recordGameStarted } from '../database/user/userStats.js';
const router = express.Router();

router.get('/data', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    
    const { username, userId, gamesPlayed, gamesWon, lastPlayedDate } = req.session.user;

    const dateObj = new Date(lastPlayedDate);
    const formattedLastPlayedDate= dateObj.toLocaleDateString();
    console.log({ username, userId, gamesPlayed, gamesWon, lastPlayedDate  });
    res.json({ username:username, userId:userId, gamesPlayed:gamesPlayed, gamesWon:gamesWon, lastPlayedDate:formattedLastPlayedDate });
});

router.post('/startNew', async (req, res) => {
    try {
        const { username, userId, gamesPlayed,gamesWon,lastPlayedDate } = req.session.user;
        
        const result = await recordGameStarted(userId, gamesPlayed,lastPlayedDate);

        if (result.success) {
            req.session.user.gamesPlayed = result.gamesPlayed;

            return res.json({
                message: 'Games played incremented successfully.',
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