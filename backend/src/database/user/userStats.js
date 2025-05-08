import pool from '../db.js';

import { isSameDate } from '../../logic/helpers/date.js';
async function getUserStats(userId) {
    console.log("Retrieving stats for user ID:", userId);

    try {
        // get user's stats (games played and games won)
        const result = await pool.query(
            'SELECT games_played, games_won,last_played_date FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return { success: false, message: 'User stats not found.' };
        }

        const stats = result.rows[0];  // retrieve the stats from the query result
        return { success: true, gamesPlayed: stats.games_played, gamesWon: stats.games_won, lastPlayedDate: stats.last_played_date };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}


async function recordGameStarted(userId, currentGamesPlayed, lastPlayedDate) {
    console.log("Incrementing games played for user ID:", userId);

    try {

        const currentDate = new Date();
        if (isSameDate(lastPlayedDate, currentDate)) {
            console.log("ALREADY PLAYED");
            return { success: false, message: 'You have already played today.' };
        }

        const updatedGamesPlayed = currentGamesPlayed + 1;
        console.log(currentDate);
        const result = await pool.query(
            'UPDATE users SET games_played = $1, last_played_date = $2 WHERE id = $3',
            [updatedGamesPlayed, currentDate, userId] 
        );
        console.log(today);
        if (result.rowCount === 0) {
            return { success: false, message: 'Failed to update games played.' };
        }

        console.log(`Games played for user ${userId} updated to ${updatedGamesPlayed}. Last game's date updated to ${currentDate}'`);

        // Return success response with updated games played count
        return { success: true, gamesPlayed: updatedGamesPlayed };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}

async function recordGameWon(userId, currentGamesWon) {
    console.log("Incrementing games won for user ID:", userId);

    try {
        // Increment the games played count by 1
        const updatedGamesWon = currentGamesWon + 1;



        const result = await pool.query(
            'UPDATE users SET games_won= $1 WHERE id = $2',
            [updatedGamesWon, userId]
        );

        if (result.rowCount === 0) {
            return { success: false, message: 'User not found or stats not updated.' };
        }

        console.log(`Games won for user ${userId} updated to ${updatedGamesWon}.`);
        return { success: true, gamesWon: updatedGamesWon };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}
export { getUserStats, recordGameStarted, recordGameWon };