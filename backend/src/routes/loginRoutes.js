import express from 'express';  
import { checkUserCredentials, checkUserExistance, checkEmailUsed } from '../database/user/userCredentials.js';
import createNewUser from '../database/user/registerUser.js';
import { updateUserSessionStats } from '../database/user/userStats.js';
import { validatePassword, validateUsername, validateEmail } from '../logic/validateCredentials.js';

const router = express.Router();
/*
Authenticate a user and initialize their session.

Validates the username and password formats, checks credentials
against the database, then stores `username` and `userId` in
`req.session.user`. Finally, fetches and stores the user’s
game stats in the session.
*/
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
    req.session.user = {
        username: username,
        userId: result.userId
    };

    // Get user stats after login
    const statsResult = await updateUserSessionStats(req);
    if (!statsResult.success) {
        console.log("FAILED");
        return res.status(404).json({ error: statsResult.message });
    }

    console.log(statsResult.lastPlayedDate);
    console.log("Session ID:", req.sessionID);
    console.log(req.session);
    return res.json({
        message: 'Login successful',
    });
});
/*
Log out the current user by clearing their session.

Destroys the Express session, clears the session cookie,
and returns a success message.
*/

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

/*

Register a new user account.

Validates username, email, and password formats, checks
for existing username/email conflicts, then creates the new
user in the database and returns a success message.
*/
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
 /*
 
Allow the user to proceed to the game by setting a session flag.

Sets `req.session.allowedToContinue = true` and returns success.
*/
router.post('/allow', (req, res) => {
    console.log("Session data:", req.session);
    

    req.session.allowedToContinue = true;

    console.log("Session data:", req.session);
    res.json({ success: true });
});
/*
Check if the user is permitted to continue to the game.

If `allowedToContinue` is not set in the session, returns 403;
otherwise returns access granted.
*/
router.get('/checkIfAllowed', async (req, res) => {
    if (!req.session.allowedToContinue) {
        console.log("Go back home");
        return res.status(403).json({ error: 'Access denied' });
    }

    // respond properly if allowed
    return res.status(200).json({ message: 'Access granted' });
})
export default router;
