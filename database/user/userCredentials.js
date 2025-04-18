import pool from '../db.js';
import argon2 from 'argon2';  // Using argon2 instead of bcrypt


async function checkUserCredentials(username, password) {
    console.log("USER LOGIN");
    console.log(username);

    
    try {
        if (!(await checkUserExistance(username, password))) {
            return { success: false, message: 'Invalid username or password.' };
        }
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        const user = result.rows[0];
        console.log(user);
        const isValid = await argon2.verify(user.password_hash, password);

        if (!isValid) {
            return { success: false, message: 'Invalid username or password.' };
        }

        return { success: true, user };

    } catch (error) {
        console.error('DB Error:', error);
        return { success: false, message: 'Database error' };
    }
}



async function checkUserExistance(username) { 

    
    try {
        const result = await pool.query('SELECT username FROM users WHERE username = $1', [username]);

        // Check if the username already exists
        if (result.rows.length > 0) {
            return true;  // Username already taken
        } else {
            return false;  // Username is available
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}
async function checkEmailUsed(email) {

    try {
        const result = await pool.query('SELECT username FROM users WHERE email = $1', [email]);

        // Check if the user with this email already exists
        if (result.rows.length > 0) {
            return true;  // Email already taken
        } else {
            return false;  // Email is available
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}

export {
    checkUserCredentials,checkUserExistance,checkEmailUsed};