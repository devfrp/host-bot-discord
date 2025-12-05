import React, { useState } from 'react';

function App() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000');
  const [manageUrl, setManageUrl] = useState('http://localhost:5002');
  const [logsUrl, setLogsUrl] = useState('http://localhost:5001');
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [botLog, setBotLog] = useState('');
  const [newBotName, setNewBotName] = useState('');
  const [editConfig, setEditConfig] = useState(null);
  const [configText, setConfigText] = useState('');

  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/bots`);
      const data = await res.json();
      setBots(data.bots || []);
    } catch (e) {
      setBots([]);
    }
    setLoading(false);
  };

  const handleStart = async (name) => {
    await fetch(`${backendUrl}/bots/${encodeURIComponent(name)}/start`, { method: 'POST' });
    fetchBots();
  };
  const handleStop = async (name) => {
    await fetch(`${backendUrl}/bots/${encodeURIComponent(name)}/stop`, { method: 'POST' });
    fetchBots();
  };

  const fetchLog = async (name) => {
    setSelectedBot(name);
    try {
      const res = await fetch(`${logsUrl}/logs/${encodeURIComponent(name)}`);
      const data = await res.json();
      setBotLog(data.log || '');
    } catch (e) {
      setBotLog('Erreur de récupération du log');
    }
  };

  // Ajout d'un bot
  const handleAddBot = async () => {
    if (!newBotName) return;
    await fetch(`${manageUrl}/bots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBotName })
    });
    setNewBotName('');
    fetchBots();
  };
  // Suppression d'un bot
  const handleDeleteBot = async (name) => {
    await fetch(`${manageUrl}/bots/${encodeURIComponent(name)}`, { method: 'DELETE' });
    fetchBots();
    setSelectedBot(null);
    setEditConfig(null);
  };
  // Editer la config
  const handleEditConfig = async (name) => {
    setEditConfig(name);
    try {
      const res = await fetch(`${manageUrl}/bots/${encodeURIComponent(name)}/config`);
      const data = await res.json();
      setConfigText(JSON.stringify(data.config, null, 2));
    } catch (e) {
      setConfigText('Erreur de chargement');
    }
  };
  // Sauver la config
  const handleSaveConfig = async () => {
    try {
      await fetch(`${manageUrl}/bots/${encodeURIComponent(editConfig)}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: configText
      });
      setEditConfig(null);
      fetchBots();
    } catch (e) {}
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Bot Manager GUI (indépendant)</h1>
      <div style={{ marginBottom: 16 }}>
        <label>Backend URL : </label>
        <input value={backendUrl} onChange={e => setBackendUrl(e.target.value)} style={{ width: 300 }} />
        <button onClick={fetchBots} style={{ marginLeft: 8 }}>Charger les bots</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Logs API URL : </label>
        <input value={logsUrl} onChange={e => setLogsUrl(e.target.value)} style={{ width: 300 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Gestion API URL : </label>
        <input value={manageUrl} onChange={e => setManageUrl(e.target.value)} style={{ width: 300 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <input value={newBotName} onChange={e => setNewBotName(e.target.value)} placeholder="Nom du nouveau bot" style={{ width: 200 }} />
        <button onClick={handleAddBot} style={{ marginLeft: 8 }}>Ajouter un bot</button>
      </div>
      {loading ? <div>Chargement...</div> : null}
      <ul>
        {bots.map(bot => (
          <li key={bot.name} style={{ marginBottom: 8 }}>
            <span style={{ cursor: 'pointer', textDecoration: selectedBot === bot.name ? 'underline' : 'none' }} onClick={() => fetchLog(bot.name)}>
              {bot.name}
            </span>
            <span style={{ color: bot.running ? 'green' : 'red', marginLeft: 8 }}>{bot.running ? '●' : '○'}</span>
            {bot.running ? (
              <button style={{ marginLeft: 8 }} onClick={() => handleStop(bot.name)}>Arrêter</button>
            ) : (
              <button style={{ marginLeft: 8 }} onClick={() => handleStart(bot.name)}>Démarrer</button>
            )}
            <button style={{ marginLeft: 8 }} onClick={() => fetchLog(bot.name)}>Voir logs</button>
            <button style={{ marginLeft: 8, color: 'red' }} onClick={() => handleDeleteBot(bot.name)}>Supprimer</button>
            <button style={{ marginLeft: 8 }} onClick={() => handleEditConfig(bot.name)}>Éditer config</button>
          </li>
        ))}
      </ul>
      {selectedBot && (
        <div style={{ marginTop: 24, background: '#222', padding: 16, borderRadius: 8 }}>
          <h3>Logs de {selectedBot}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#eee', maxHeight: 300, overflowY: 'auto' }}>{botLog}</pre>
        </div>
      )}
      {editConfig && (
        <div style={{ marginTop: 24, background: '#222', padding: 16, borderRadius: 8 }}>
          <h3>Édition de la config de {editConfig}</h3>
          <textarea value={configText} onChange={e => setConfigText(e.target.value)} style={{ width: '100%', height: 200, fontFamily: 'monospace', fontSize: 14 }} />
          <button style={{ marginTop: 8 }} onClick={handleSaveConfig}>Sauver</button>
          <button style={{ marginLeft: 8, marginTop: 8 }} onClick={() => setEditConfig(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
}

export default App;
