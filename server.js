require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userMessage }]
          }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    res.json({ reply: aiText });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini API.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
