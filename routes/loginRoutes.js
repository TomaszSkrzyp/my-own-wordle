import express from 'express';  
const router = express.Router();
import { checkUserCredentials, checkUserExistance, checkEmailUsed } from '../database/user/userCredentials.js';

import createNewUser from '../database/user/registerUser.js';


import { validatePassword, validateUsername, validateEmail } from '../logic/validateCredentials.js';
//api/login/
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!validateUsername(username)) {
        return res.status(400).json({ message: 'Invalid username format.' });
    }


    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }
    const result = await checkUserCredentials(username, password);
    console.log(result);
    if (!result.success) {
        return res.status(401).json({ error: result.message });
    }

    res.json({ message: 'Login successful' });
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!validateUsername(username)) {
        return res.status(400).json({ message: 'Invalid username format.' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }

    const usernameUsed = await checkUserExistance(username);
    const emailUsed = await checkEmailUsed(email);
    console.log(usernameUsed);
    console.log(usernameUsed);
    console.log("ONFIJNSFDJODM");
    if ( usernameUsed) {
        
        return res.status(409).json({ message: 'This username is already in use.' });
    }

    if ( emailUsed) {
        return res.status(409).json({ message: 'This e-mail is already in use.' });
    }
    
    //Registration result
    const regRes= await createNewUser(username, email, password);
    if (!regRes.success) {
        return res.status(401).json({ error: regRes.message });
    }
    return res.status(201).json({ message: 'Registration successful.' });
});
export default router;
