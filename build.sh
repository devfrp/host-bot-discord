#!/bin/bash

echo " Construction de l'application Bot Manager..."
echo ""

cd "$(dirname "$0")"

# Vérifier la plateforme
SYSTEM=$(uname -s)

echo "  Système détecté: $SYSTEM"
echo ""

# Construire avec vite
echo " Construction avec Vite..."
npm run build

if [ $? -ne 0 ]; then
    echo " Erreur lors de la construction"
    exit 1
fi

echo ""
echo " Construction de l'exécutable..."

# Déterminer la commande appropriée selon le système
if [ "$SYSTEM" = "Linux" ]; then
    echo " Compilation pour Linux..."
    npm run package-linux
elif [ "$SYSTEM" = "Darwin" ]; then
    echo " Compilation pour macOS..."
    npm run package-mac
else
    echo " Plateforme non supportée: $SYSTEM"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo " Compilation réussie!"
    echo " Les fichiers se trouvent dans le dossier 'dist/'"
    ls -lah dist/
else
    echo "Erreur lors de la compilation"
    exit 1
fi
