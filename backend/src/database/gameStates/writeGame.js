import pool from '../db.js';

/*
Inserts or updates a user’s current game state in the database.

Uses an upsert to store the full game state JSON and sets `updated_at` to now.
Logs warnings if userId or gameState is missing.
*/
 async function saveStateToDB(userId, gameState) {
    if (!userId || !gameState) {
        console.warn('Missing userId or gameState — not saving');
        return;
    }

    try {
        await pool.query(`
      INSERT INTO game_states (user_id, game_data)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET game_data = EXCLUDED.game_data, updated_at = NOW()
    `, [userId, gameState]);

        console.log(` Game state saved for user ${userId}`);
    } catch (error) {
        console.error('Failed to save game state to DB:', error);
    }
}
export default saveStateToDB;