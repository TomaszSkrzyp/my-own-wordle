
import dotenv from 'dotenv';
dotenv.config(); 

import { env } from './src/config/validateEnv.js'; // after dotenv

import express from 'express';
import session from 'express-session';

import lusca from 'lusca';
import cors from 'cors';
import bodyParser from 'body-parser';

import userRoutes from './src/routes/userRoutes.js';
import wordRoutes from './src/routes/wordRoutes.js';
import loginRoutes from './src/routes/loginRoutes.js';
import startTasks from './src/config/serverSetup.js';


const app = express();

// Setup
const port = env.BACK_PORT;
const front_port = env.FRONT_PORT;
const server_secret = env.SECRET;
// Middleware
app.use(cors({

    origin: 'http://localhost:'+(front_port),
  credentials: true
}));


app.use(session({
  secret: server_secret,
  resave: false,
  saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: null    } //switch to true for production
}));

app.use(bodyParser.json());



// lusca setup
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use('/api/word', wordRoutes);

app.use('/api/user', userRoutes);

app.use('/api/login', loginRoutes);
app.get('/api/csrf-token', (req, res) => {
    // Log the CSRF token stored in the session
    console.log('CSRF Token from session:', req.session._csrfSecret);

    // Generate and log the current CSRF token for the request
    const csrfToken = req.csrfToken();
    console.log('Current CSRF Token for the request:', csrfToken);

    // Send the CSRF token to the client
    res.json({ csrfToken });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});;

startTasks();