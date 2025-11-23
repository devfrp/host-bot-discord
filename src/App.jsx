import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [bots, setBots] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBots();
    const unsubscribe = window.electron.onBotLog((data) => {
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), ...data }]);
    });

    window.electron.onBotStopped((botName) => {
      setBots(prev => prev.map(bot => bot.name === botName ? { ...bot, running: false } : bot));
    });

    return unsubscribe;
  }, []);

  const loadBots = async () => {
    try {
      const botList = await window.electron.getBots();
      setBots(botList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading bots:', error);
      setIsLoading(false);
    }
  };

  const handleStartBot = async (botName) => {
    const result = await window.electron.startBot(botName);
    if (result.success) {
      setBots(prev => prev.map(bot => bot.name === botName ? { ...bot, running: true } : bot));
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), bot: botName, message: result.message, type: 'success' }]);
    }
  };

  const handleStopBot = async (botName) => {
    const result = await window.electron.stopBot(botName);
    if (result.success) {
      setBots(prev => prev.map(bot => bot.name === botName ? { ...bot, running: false } : bot));
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), bot: botName, message: result.message, type: 'info' }]);
    }
  };

  if (isLoading) {
    return <div className="app"><div className="loading">Chargement des bots...</div></div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Bot Manager - Discord</h1>
        <p>Gérez tous vos bots Discord desde une interface intuitive</p>
      </header>

      <div className="container">
        <div className="sidebar">
          <h2>Bots ({bots.length})</h2>
          <div className="bot-list">
            {bots.map(bot => (
              <div
                key={bot.name}
                className={`bot-card ${bot.running ? 'running' : 'stopped'} ${selectedBot === bot.name ? 'selected' : ''}`}
                onClick={() => setSelectedBot(bot.name)}
              >
                <div className="bot-header">
                  <h3>{bot.name}</h3>
                  <span className={`status-badge ${bot.running ? 'active' : 'inactive'}`}>
                    {bot.running ? '● En ligne' : '○ Hors ligne'}
                  </span>
                </div>
                <div className="bot-actions">
                  {bot.running ? (
                    <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleStopBot(bot.name); }}>
                      Arrêter
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={(e) => { e.stopPropagation(); handleStartBot(bot.name); }}>
                      Démarrer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="main-content">
          <div className="logs-container">
            <h2>Logs en temps réel</h2>
            <div className="logs">
              {logs.length === 0 ? (
                <p className="no-logs">Aucun log pour le moment...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`log-entry ${log.type}`}>
                    <span className="timestamp">[{log.timestamp}]</span>
                    <span className="bot-name">[{log.bot}]</span>
                    <span className="message">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
