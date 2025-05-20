//PROJEKT
import fs from 'fs';
import path from 'path';
import pool from '../db.js';

async function insertWordsToDatabase() {
    try {
        const wordsFilePath = path.resolve('./files/words.txt');  // Path inside container
        const data = await fs.promises.readFile(wordsFilePath, 'utf8');
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

export {insertWordsToDatabase};
