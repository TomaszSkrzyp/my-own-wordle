import pool from '../db.js';

let cachedWord = null;
let cachedDate = null;
//Retrieve today's word from db or cache
async function retrieveTodays() {
    const today = new Date().toISOString().split('T')[0];  

    // If the word for today is already cached, return it
    if (cachedWord && cachedDate === today) {
        console.log("cached");
        return cachedWord;
    }

    try {
        console.log('Cache miss. Fetching from database...');
        const res = await pool.query('SELECT word FROM words WHERE date_used = CURRENT_DATE LIMIT 1;');


        if (res.rows.length > 0) {
            cachedWord = res.rows[0].word;
            cachedDate = today; 
            console.log('Cache updated with new word:', cachedWord);
            return cachedWord;
        }

        return null;  
    } catch (error) {
        console.error('Error fetching word:', error);
        return null;
    }
}

async function showTodaysWord() {
    const word = await retrieveTodays();
    console.log('Today\'s word:', word);
}

async function simulateCalls() {
    await showTodaysWord();  
    await showTodaysWord();  
    await showTodaysWord(); 
}


export default retrieveTodays;