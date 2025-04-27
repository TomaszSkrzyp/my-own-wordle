import express from 'express';
import session from 'express-session';
import wordRoutes from './routes/wordRoutes.js';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';
import startTasks from './utils/serverSetup.js';

const app = express();
const port = 5000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); // <-- THIS LINE is essential

app.use(session({
  secret: 'wordle_game_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use('/api/word', wordRoutes);


app.use('/api/login', loginRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


startTasks();