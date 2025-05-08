import express from 'express';  
import { checkUserCredentials, checkUserExistance, checkEmailUsed } from '../database/user/userCredentials.js';
import createNewUser from '../database/user/registerUser.js';
import { getUserStats } from '../database/user/userStats.js';
import { validatePassword, validateUsername, validateEmail } from '../logic/validateCredentials.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!validateUsername(username)) {
        return res.status(400).json({ message: 'Invalid username format.' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }

    const result = await checkUserCredentials(username, password);
    if (!result.success) {
        return res.status(401).json({ error: result.message });
    }

    // Get user stats after login
    const statsResult = await getUserStats(result.userId);
    if (!statsResult.success) {
        return res.status(404).json({ error: statsResult.message });
    }

    // Save user info and stats to session
    req.session.user = {
        username: username,
        userId: result.userId,
        gamesPlayed: statsResult.gamesPlayed,
        gamesWon: statsResult.gamesWon,
        lastPlayedDate: statsResult.lastPlayedDate,
    };
    console.log(statsResult.lastPlayedDate);
    console.log("Session ID:", req.sessionID);
    return res.json({
        message: 'Login successful',
        username: username,
        gamesPlayed: statsResult.gamesPlayed,
        gamesWon: statsResult.gamesWon,
        lastPlayedDate: statsResult.lastPlayedDate,
    });
});


router.post('/logout', async (req, res) => {
    console.log("logging out");
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: 'Logout failed' });
            }

            res.clearCookie('connect.sid', {
                path: '/',          // matches the session cookie's path
                httpOnly: true,
                sameSite: 'lax',    // or 'none' if cross-site
                secure: false       // true if using HTTPS
            });

            res.json({ message: 'Logged out successfully' });
        });
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

    if (usernameUsed) {
        return res.status(409).json({ message: 'This username is already in use.' });
    }

    if (emailUsed) {
        return res.status(409).json({ message: 'This e-mail is already in use.' });
    }

    const regRes = await createNewUser(username, email, password);
    if (!regRes.success) {
        return res.status(401).json({ error: regRes.message });
    }

   

    return res.status(201).json({ message: 'Registration successful.' });
 });

router.post('/allow', (req, res) => {
    console.log("Session data:", req.session);
    

    req.session.allowedToContinue = true;

    console.log("Session data:", req.session);
    res.json({ success: true });
});

router.get('/checkIfAllowed', async (req, res) => {
    if (!req.session.allowedToContinue) {
        console.log("Go back home");
        return res.status(403).json({ error: 'Access denied' });
    }

    // respond properly if allowed
    return res.status(200).json({ message: 'Access granted' });
})
export default router;
