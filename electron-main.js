const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const { readdirSync } = require('fs');
const { join } = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
const ChildCache = new Map();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${join(__dirname, 'build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('get-bots', async (event, customPath) => {
  const botsPath = customPath || join(__dirname, './Bots');
  try {
    const bots = readdirSync(botsPath);
    return {
      bots: bots.map(bot => ({
        name: bot,
        path: join(botsPath, bot),
        running: ChildCache.has(bot),
      })),
      path: botsPath
    };
  } catch (error) {
    return { bots: [], path: botsPath };
  }
});

ipcMain.handle('select-bots-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Sélectionnez le dossier contenant vos bots Discord',
  });
  if (result.canceled || !result.filePaths || !result.filePaths[0]) return null;
  return result.filePaths[0];
});

ipcMain.handle('start-bot', async (event, botName) => {
  if (ChildCache.has(botName)) {
    return { success: false, message: 'Bot already running' };
  }

  const botPath = join(__dirname, './Bots', botName);
  
  try {
    const child = spawn('node', ['.'], {
      cwd: botPath,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    ChildCache.set(botName, child);

    child.stdout.on('data', (data) => {
      mainWindow?.webContents.send('bot-log', {
        bot: botName,
        message: data.toString(),
        type: 'info',
      });
    });

    child.stderr.on('data', (data) => {
      mainWindow?.webContents.send('bot-log', {
        bot: botName,
        message: data.toString(),
        type: 'error',
      });
    });

    child.on('exit', () => {
      ChildCache.delete(botName);
      mainWindow?.webContents.send('bot-stopped', botName);
    });

    return { success: true, message: `Bot ${botName} started` };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('stop-bot', async (event, botName) => {
  const child = ChildCache.get(botName);
  if (child) {
    child.kill();
    ChildCache.delete(botName);
    return { success: true, message: `Bot ${botName} stopped` };
  }
  return { success: false, message: 'Bot not running' };
});

ipcMain.handle('get-bot-logs', async (event, botName) => {
  return [];
});

app.on('before-quit', () => {
  for (const [bot, child] of ChildCache) {
    child.kill();
  }
});
