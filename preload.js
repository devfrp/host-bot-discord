const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getBots: () => ipcRenderer.invoke('get-bots'),
  startBot: (botName) => ipcRenderer.invoke('start-bot', botName),
  stopBot: (botName) => ipcRenderer.invoke('stop-bot', botName),
  getBotLogs: (botName) => ipcRenderer.invoke('get-bot-logs', botName),
  onBotLog: (callback) => ipcRenderer.on('bot-log', (event, data) => callback(data)),
  onBotStopped: (callback) => ipcRenderer.on('bot-stopped', (event, botName) => callback(botName)),
});
