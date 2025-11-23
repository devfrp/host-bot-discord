# EN COURS DE DEVLOPPEMENT
MERCI DE COTRE COMPRENSSION

# Bot Manager - Application Desktop

Une application desktop moderne pour gérer tous vos bots Discord depuis une interface graphique intuitive.

## Fonctionnalités

✨ **Interface graphique intuitive** - Gestion facile de tous vos bots
🚀 **Démarrage/Arrêt instantané** - Contrôlez vos bots en un clic
📊 **Logs en temps réel** - Suivez l'activité de vos bots
💻 **Multi-plateforme** - Windows, macOS, Linux

## Installation

### Prérequis

- Node.js 16+ 
- npm ou yarn

### Étapes d'installation

1. Installez les dépendances :
```bash
npm install
```

2. Installez également les dépendances supplémentaires pour Electron :
```bash
npm install --save-dev concurrently wait-on
```

## Développement

Pour lancer l'application en mode développement :

```bash
npm start
```

Cela va lancer à la fois le serveur React et l'application Electron.

## Build & Déploiement

### Windows
```bash
npm run build-win
```

### macOS
```bash
npm run build-mac
```

### Linux
```bash
npm run build-linux
```

### Tous les systèmes
```bash
npm run build
```

Les exécutables seront générés dans le dossier `dist/`.

## Structure du projet

```
host-bot-discord/
├── src/                    # Code React
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── public/                 # Fichiers publics
│   └── index.html
├── Bots/                   # Vos bots Discord
├── electron-main.js        # Processus principal Electron
├── preload.js              # Script de précharge
├── package.json            # Dépendances et scripts
└── README.md
```

## Technologies utilisées

- **Electron** - Framework pour applications desktop
- **React** - Bibliothèque UI
- **Node.js** - Runtime JavaScript
- **electron-builder** - Builder pour les exécutables

## Licence

MIT

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.
