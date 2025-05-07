import pool from '../db.js';
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
        console.log(stats);
        return { success: true, gamesPlayed: stats.games_played, gamesWon: stats.games_won, lastPlayedDate: stats.last_played_date };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}


async function recordGameStarted(userId, currentGamesPlayed) {
    console.log("Incrementing games played for user ID:", userId);

    try {
        // Increment the games played count by 1
        const updatedGamesPlayed = currentGamesPlayed + 1;

        

        const result = await pool.query(
            'UPDATE users SET games_played = $1, last_played_date = CURRENT_DATE WHERE id = $2',
            [updatedGamesPlayed, userId]
        );

        if (result.rowCount === 0) {
            return { success: false, message: 'User not found or stats not updated.' };
        }

        console.log(`gGames played for user ${userId} updated to ${updatedGamesPlayed}.`);
        return { success: true, gamesPlayed: updatedGamesPlayed };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}
export { getUserStats,recordGameStarted };