import express from 'express'; // Framework Express.js untuk membangun server
import dotenv from 'dotenv'; // Memuat variabel lingkungan dari file .env
import cors from 'cors'; // Middleware untuk menangani permintaan Cross-Origin

// Mengimpor komponen library Google Gemini
import { GoogleGenAI } from '@google/genai';

dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express(); // Membuat instance Express
const PORT = process.env.PORT || 3000; // Menentukan port server
const STATIC_PATH = 'public'; // Menentukan path statis

app.use(cors()); // Mengaktifkan middleware CORS
app.use(express.json()); // Mengaktifkan middleware untuk memparsing JSON
app.use(express.static(STATIC_PATH)); // Menentukan direktori statis untuk serving

// Membuat instance GoogleGenAI}`);
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    // Validate user messege
    // Guard clause
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const result = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: message,
        });
        const text = result.text;
        return res.status(200).json({ reply: text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ reply: 'Something went wrong.' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});