
import pool from '../db.js';
/*
Fetches the stored game state and its last update timestamp for a user.

    Queries`game_states` by`user_id` and returns an object containing the
    game data JSON and its `updated_at` timestamp, or`null` if not found.
*/
async function getStateFromDB(userId) {
    const result = await pool.query('SELECT game_data, updated_at FROM game_states WHERE user_id = $1', [userId]);

    // check if the result has rows and if game_data is available
    const gameData = result.rows[0] ? result.rows[0].game_data : null;
    const updatedAt = result.rows[0] ? result.rows[0].updated_at : null;

    return {
        data: gameData || null,  
        updated_at: updatedAt
    };
}
export default getStateFromDB;