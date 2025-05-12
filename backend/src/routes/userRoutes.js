import express from 'express';

import { updateUserSessionStats, recordGameStarted } from '../database/user/userStats.js';

const router = express.Router();

router.get('/data', async (req, res) => {
    if (!req.session.user || !req.session.user.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const userId = req.session.user.userId;

    try {
        const statsResult = await updateUserSessionStats(req, userId);  // Pass the `req` object

        if (!statsResult.success) {
            return res.status(404).json({ error: statsResult.message });
        }
        let formattedLastPlayedDate = "-";
        if (statsResult.lastPlayedDate) {
            const dateObj = new Date(statsResult.lastPlayedDate);
            formattedLastPlayedDate = dateObj.toLocaleDateString();
        }
        else {
            console.log("stqts");
            console.log(statsResult);
        }
        

        console.log({
            username: req.session.user.username,
            userId,
            gamesPlayed: statsResult.gamesPlayed,
            gamesWon: statsResult.gamesWon,
            lastPlayedDate: formattedLastPlayedDate,
            isLastPlayedToday: statsResult.isLastPlayedToday
        });

        res.json({
            username: req.session.user.username,
            gamesPlayed: statsResult.gamesPlayed,
            gamesWon: statsResult.gamesWon,
            lastPlayedDate: formattedLastPlayedDate,
            isLastPlayedToday: statsResult.isLastPlayedToday
        });
    } catch (err) {
        console.error("Error fetching user stats:", err);
        res.status(500).json({ error: 'Server error' });
    }
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