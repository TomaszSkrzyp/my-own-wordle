
import pool from '../db.js';
async function getStateFromDB(userId) {
    const result = await pool.query('SELECT game_data,updated_at FROM game_states WHERE user_id = $1', [userId]);
    console.log(result);
    return {
        data: result.rows[0].game_data || null, updated_at: result.rows[0].updated_at
    };
}
export default getStateFromDB;