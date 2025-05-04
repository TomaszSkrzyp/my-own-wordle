
import dotenv from 'dotenv';
dotenv.config(); 

import { env } from './src/config/validateEnv.js'; // after dotenv

import express from 'express';
import session from 'express-session';

import lusca from 'lusca';
import cors from 'cors';
import bodyParser from 'body-parser';

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
  cookie: { secure: false } //switch to true for production
}));

app.use(bodyParser.json());



// lusca setup
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use('/api/word', wordRoutes);


app.use('/api/login', loginRoutes);
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});;

startTasks();