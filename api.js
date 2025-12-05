const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
const { join } = require('path');

const app = express();
app.use(cors());

// GET /bots : liste les bots présents dans ./Bots
app.get('/bots', (req, res) => {
  const botsPath = join(__dirname, './Bots');
  let bots = [];
  try {
    bots = readdirSync(botsPath).map(name => ({
      name,
      running: false // Pour l'instant, on ne gère pas l'état
    }));
  } catch (e) {}
  res.json({ bots });
});


// Gestion des processus bots (partagé avec index.js)
const backend = require('./index.js');

// POST /bots/:name/start
app.post('/bots/:name/start', async (req, res) => {
  const botName = req.params.name;
  if (backend.ChildCache && backend.ChildCache.has(botName)) {
    return res.json({ success: false, message: 'Bot déjà démarré' });
  }
  try {
    await backend.Spawn(botName);
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// POST /bots/:name/stop
app.post('/bots/:name/stop', (req, res) => {
  const botName = req.params.name;
  const child = backend.ChildCache && backend.ChildCache.get(botName);
  if (child) {
    child.kill();
    backend.ChildCache.delete(botName);
    return res.json({ success: true });
  }
  res.json({ success: false, message: 'Bot non démarré' });
});

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`API REST Bot Manager démarrée sur http://localhost:${PORT}`);
});
