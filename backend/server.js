
import dotenv from 'dotenv';
dotenv.config(); 

import { env } from './src/config/validateEnv.js'; // after dotenv
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import wordRoutes from './src/routes/wordRoutes.js';
import loginRoutes from './src/routes/loginRoutes.js';
import startTasks from './src/config/serverSetup.js';
import csurf from 'csurf';

const csrfProtection = csurf({ cookie: false });
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

app.use(express.json()); //using express

app.use(session({
  secret: server_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } //Switch to true for production
}));

app.use('/api/word', wordRoutes);


app.use('/api/login', loginRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
//csrf
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

startTasks();