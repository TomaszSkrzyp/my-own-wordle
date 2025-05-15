import argon2 from 'argon2';
import pool from '../db.js';
/*
Create a new user account in the database.

Connects to the PostgreSQL pool, hashes the provided password using Argon2,
    and inserts a new record into the `users` table.Returns the new user’s id,
        username, and email on success, or an error message on failure.
*/
async function createNewUser(username, email, password) {


    try {
        await pool.connect();

        const hashedPassword = await argon2.hash(password);

        const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
        const values = [username, email, hashedPassword];

        const result = await pool.query(query, values);
        return { success: true, user: result.rows[0] };

    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Error creating user' };
    } 
}
export default createNewUser;