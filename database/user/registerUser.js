import argon2 from 'argon2';
import pool from '../db.js';
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