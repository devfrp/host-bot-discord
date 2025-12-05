# EN COURS DE DEVLOPPEMENT
MERCI DE COTRE COMPRENSSION

# Bot Manager - Application Desktop

Une application desktop moderne pour gérer tous vos bots Discord depuis une interface graphique intuitive.

## Fonctionnalités

 **Interface graphique intuitive** - Gestion facile de tous vos bots
 **Démarrage/Arrêt instantané** - Contrôlez vos bots en un clic
 **Logs en temps réel** - Suivez l'activité de vos bots
 **Multi-plateforme** - Windows, macOS, Linux

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
├── src/                    
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── public/                
│   └── index.html
├── Bots/                  
├── electron-main.js       
├── preload.js             
├── package.json          
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

## Lancement global (API + GUI)

Pour lancer à la fois l'API backend et l'interface graphique Electron :

```bash
cd .. # depuis ce dossier, remontez à la racine du projet
./start-all.sh
```

- Le script démarre l'API (host-bot-discord) et la GUI (bot-manager-gui) en parallèle.
- Faites `Ctrl+C` pour tout arrêter proprement.
- Les dépendances sont installées automatiquement si besoin.

**Prérequis** : Node.js >= 18, npm
