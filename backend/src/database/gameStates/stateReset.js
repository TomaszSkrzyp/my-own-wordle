import { initGameState} from '../../logic/initGameState.js';

import pool from '../db.js';
/*
Resets all user game states to the default initial state.

Generates a fresh game state object and updates every row in `game_states`
to that default, clearing `updated_at` timestamps.
*/
async function resetStatesToDB() {
    
    try {
        const defaultState = initGameState();
        await pool.query(`UPDATE game_states
        SET game_data = $1, updated_at = null;
    `, [ defaultState]);

        console.log(` Game states reset`);
    } catch (error) {
        console.error('Failed to reset game state in DB:', error);
    }
    console.log("RESET");
}
export default resetStatesToDB;