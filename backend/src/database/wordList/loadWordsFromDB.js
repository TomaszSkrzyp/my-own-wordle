
import pool from '../db.js';
//Retrieve all words from database
async function loadAllWords() {
    try {
        const res = await pool.query('SELECT word FROM public.words;');
        return res.rows.map(row => row.word.toLowerCase());
    } catch (error) {
        console.error('Error loading word list:', error);
        return [];
    }
}
export { loadAllWords };
