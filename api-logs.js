const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// GET /logs/:bot : retourne le contenu du log du bot
app.get('/logs/:bot', (req, res) => {
  const botName = req.params.bot;
  const logsDir = path.join(__dirname, 'Bots', botName, 'logs.txt');
  if (!fs.existsSync(logsDir)) return res.status(404).json({ error: 'Log non trouvé' });
  const content = fs.readFileSync(logsDir, 'utf8');
  res.json({ log: content });
});

const PORT = process.env.API_LOGS_PORT || 5001;
app.listen(PORT, () => {
  console.log(`API logs démarrée sur http://localhost:${PORT}`);
});
