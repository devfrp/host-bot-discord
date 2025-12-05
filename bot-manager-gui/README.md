# Bot Manager GUI

Application graphique indépendante pour la gestion des bots Discord.

- Cette app se connecte au backend (host-bot-discord) via API ou websocket.
- Lancer le backend puis l'interface graphique.

## Lancement

1. Démarrer le backend :
```bash
cd ../host-bot-discord
node index.js
```
2. Démarrer l'interface graphique :
```bash
cd ../bot-manager-gui
npm install
npm start
```

## Configuration
- L'adresse du backend peut être configurée dans un fichier `.env` ou dans l'interface.
