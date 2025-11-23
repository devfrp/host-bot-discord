const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getBots: (customPath) => ipcRenderer.invoke('get-bots', customPath),
  startBot: (botName) => ipcRenderer.invoke('start-bot', botName),
  stopBot: (botName) => ipcRenderer.invoke('stop-bot', botName),
  getBotLogs: (botName) => ipcRenderer.invoke('get-bot-logs', botName),
  selectBotsPath: () => ipcRenderer.invoke('select-bots-path'),
  onBotLog: (callback) => ipcRenderer.on('bot-log', (event, data) => callback(data)),
  onBotStopped: (callback) => ipcRenderer.on('bot-stopped', (event, botName) => callback(botName)),
});
