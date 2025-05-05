//PROJEKT
import fs from 'fs';
import pool from '../db.js';

async function insertWordsToDatabase() {
    try {
        const data = await fs.promises.readFile('words.txt', 'utf8');
        const words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);

        for (let word of words) {
            try {
                // Insert each word into the database
                await pool.query('INSERT INTO words (word) VALUES ($1) ON CONFLICT (word) DO NOTHING', [word]);
                console.log(`Inserted word: ${word}`);
            } catch (err) {
                console.error(`Error inserting word ${word}:`, err);
            }
        }

        console.log('Finished inserting words into the database.');
    } catch (err) {
        console.error('Error reading the file:', err);
    }
}

insertWordsToDatabase();
