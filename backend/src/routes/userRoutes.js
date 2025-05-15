import express from 'express';

import { updateUserSessionStats, recordGameStarted } from '../database/user/userStats.js';

const router = express.Router();
/*

Retrieve and return the current user’s game statistics.

Requires an authenticated session (`req.session.user.userId`). Updates the
session with latest stats from the database, formats the last played date,
and responds with username, games played, games won, last played date, and
whether they have already played today.
*/
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
/*

Record the start of a new game for the user.

Checks if they have already played today; if not, increments their
`games_played` and updates the database, then returns a success message.
*/
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