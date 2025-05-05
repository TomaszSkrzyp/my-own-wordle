import  pool from '../db.js';
import  retrieveTodays  from './wordRetrieval.js';
async function setRandom() {
    const isTodaysWordRetrieved = await retrieveTodays();
    if (isTodaysWordRetrieved) {
        console.log("Today's word has already been retrieved.");
        return ;
    }

    try {
        const res = await pool.query(`
            SELECT word 
            FROM words 
            WHERE date_used IS NULL OR date_used < CURRENT_DATE - INTERVAL '1 year'
            ORDER BY RANDOM() 
            LIMIT 1;
`           );

        if (res.rows.length === 0) {
            console.log("NO WORD");
            return null;
        }
        const word = res.rows[0].word;
        console.log(word);

        await pool.query('UPDATE words SET date_used = CURRENT_DATE WHERE word = $1;', [word]);
        console.log(word);
        return word;
    } catch (error) {
        console.error('Error setting random word:', error);
        return null;
    }
}

async function testSetRandom() {
    const randomWord = await setRandom();
    if (randomWord) {
        console.log('Random word for today is:', randomWord);
    } else {
        console.log('No word was set or an error occurred.');
    }
    console.log("cool");
    return;
}

testSetRandom();
export default setRandom ;