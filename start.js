#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Vérifier si node_modules existe
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installation des dépendances...');
  const install = spawn('npm', ['install'], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  install.on('exit', (code) => {
    if (code === 0) {
      startApp();
    } else {
      console.error('Erreur lors de l\'installation des dépendances');
      process.exit(1);
    }
  });
} else {
  startApp();
}

function startApp() {
  console.log('Démarrage de l\'application...');
  
  const viteProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    cwd: __dirname,
  });

  setTimeout(() => {
    const electronProcess = spawn('npx', ['electron', 'electron-main.js'], {
      stdio: 'inherit',
      cwd: __dirname,
      env: {
        ...process.env,
        ELECTRON_IS_DEV: 'true',
      },
    });

    electronProcess.on('exit', () => {
      viteProcess.kill();
      process.exit(0);
    });
  }, 3000);
}
