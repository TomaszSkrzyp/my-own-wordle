import pool from '../db.js';
import argon2 from 'argon2'; 

/*
Verify a user’s login credentials.

Checks that the given username exists, then fetches the stored password hash
and verifies it against the provided password. Returns success with userId
and username, or an error message if invalid.
*/
async function checkUserCredentials(username, password) {

    
    try {
        if (!(await checkUserExistance(username, password))) {
            return { success: false, message: 'Invalid username or password.' };
        }
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        const user = result.rows[0];
        const isValid = await argon2.verify(user.password_hash, password);

        if (!isValid) {
            return { success: false, message: 'Invalid username or password.' };
        }

        return { success: true, username:user.userName, userId:user.id };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}

/*
Check if a username already exists in the database.

Runs a SELECT query on the `users` table by username. Returns true if at
least one row is found, false otherwise.
*/

async function checkUserExistance(username) { 

    
    try {
        const result = await pool.query('SELECT username FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            return true; 
        } else {
            return false;  
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}
/*
Check if an email address is already used by another account.

Queries the `users` table by email. Returns true if the email exists,
false otherwise.
*/
async function checkEmailUsed(email) {

    try {
        const result = await pool.query('SELECT username FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}

export {
    checkUserCredentials,checkUserExistance,checkEmailUsed};