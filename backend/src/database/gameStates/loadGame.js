
import pool from '../db.js';
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