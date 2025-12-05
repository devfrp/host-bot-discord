
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Création automatique d'un bot de test si aucun bot n'existe
if (!fs.existsSync(botsRoot)) fs.mkdirSync(botsRoot);
const botsList = fs.readdirSync(botsRoot).filter(f => fs.statSync(path.join(botsRoot, f)).isDirectory());
if (botsList.length === 0) {
  const testBotPath = path.join(botsRoot, 'bot-test');
  fs.mkdirSync(testBotPath);
  fs.writeFileSync(path.join(testBotPath, 'config.json'), JSON.stringify({ name: 'bot-test', auto: true }, null, 2));
  console.log('Bot de test créé automatiquement.');
}

const app = express();
app.use(cors());
app.use(express.json());

const botsRoot = path.join(__dirname, 'Bots');

// POST /bots : ajouter un bot
app.post('/bots', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  const botPath = path.join(botsRoot, name);
  if (fs.existsSync(botPath)) return res.status(409).json({ error: 'Bot existe déjà' });
  fs.mkdirSync(botPath);
  fs.writeFileSync(path.join(botPath, 'config.json'), JSON.stringify({ name }, null, 2));
  res.json({ success: true });
});

// DELETE /bots/:name : supprimer un bot
app.delete('/bots/:name', (req, res) => {
  const botName = req.params.name;
  const botPath = path.join(botsRoot, botName);
  if (!fs.existsSync(botPath)) return res.status(404).json({ error: 'Bot introuvable' });
  fs.rmSync(botPath, { recursive: true, force: true });
  res.json({ success: true });
});

// GET /bots/:name/config : lire la config
app.get('/bots/:name/config', (req, res) => {
  const botName = req.params.name;
  const configPath = path.join(botsRoot, botName, 'config.json');
  if (!fs.existsSync(configPath)) return res.status(404).json({ error: 'Config introuvable' });
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  res.json({ config });
});

// PUT /bots/:name/config : éditer la config
app.put('/bots/:name/config', (req, res) => {
  const botName = req.params.name;
  const configPath = path.join(botsRoot, botName, 'config.json');
  if (!fs.existsSync(configPath)) return res.status(404).json({ error: 'Config introuvable' });
  fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

const PORT = process.env.API_BOT_MANAGE_PORT || 5002;
app.listen(PORT, () => {
  console.log(`API gestion bots démarrée sur http://localhost:${PORT}`);
});
