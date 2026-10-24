#!/bin/bash
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.cargo/bin:$HOME/.local/share/pnpm:$HOME/Library/pnpm:$PATH"

echo "Removendo DMGs anteriores..."
rm -f ./*.dmg

echo "Iniciando o build de producao do Chess Mastery (Tauri v2)..."
pnpm tauri build

echo "Buscando o instalador .dmg gerado..."
DMG_FILE=$(find /tmp/chess-mastery-target/release/bundle/dmg src-tauri/target/release/bundle/dmg -name "*.dmg" 2>/dev/null | head -n 1)

if [ -n "$DMG_FILE" ]; then
  FILENAME=$(basename "$DMG_FILE")
  echo "Instalador encontrado: $DMG_FILE"
  cp "$DMG_FILE" ./
  echo "Sucesso! $FILENAME movido para a raiz de Chess Mastery."
else
  echo "Erro: O arquivo .dmg nao foi localizado."
  exit 1
fi
