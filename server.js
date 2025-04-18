import express from 'express';
import wordRoutes from './routes/wordRoutes.js';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';
import { initWordList } from './logic/wordService.js';

const app = express();
const port = 5000; // Or any port you're using for the backend

await initWordList();
// Enable CORS for React
app.use(cors());

// Parse incoming JSON
app.use(express.json());

// Use the word routes for API endpoints
app.use('/api/word', wordRoutes);

app.use('/api/login', loginRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
