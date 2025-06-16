const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();

// ✅ CORS freischalten für dein Frontend
app.use(cors({
  origin: 'https://ki-frontend-jade.vercel.app',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// ⬇️ Beispiel-Route
app.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Kein Text erhalten.' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Du bist ein hilfreicher Assistent.' },
        { role: 'user', content: message },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Fehler bei OpenAI:', error.message);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung.' });
  }
});

app.listen(10000, () => {
  console.log('Server läuft auf Port 10000');
});
