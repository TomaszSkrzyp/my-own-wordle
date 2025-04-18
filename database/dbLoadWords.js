//PROJEKT
import fs from 'fs';
import pool from '../database/db.js';

fs.readFile('words.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);

    for (let word of words) {
        try {

            await pool.query('INSERT INTO words (word) VALUES ($1) ON CONFLICT (word) DO NOTHING', [word]);
            console.log(`Inserted word: ${word}`);
        } catch (err) {
            console.error(`Error inserting word ${word}:`, err);
        }
    }

    console.log('Finished inserting words into the database.');
});
