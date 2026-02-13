#!/bin/bash
# Production deploy for corexdigital.de (Ubuntu, nginx, pm2)
# Run from repo root on server: /var/www/corex-website
# Usage: ./scripts/deploy.sh

set -e
cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

echo "[deploy] Pulling latest..."
git pull

echo "[deploy] Frontend: install and build..."
cd "$REPO_ROOT/frontend"
npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund
export REACT_APP_API_URL=https://corexdigital.de
export NEXT_PUBLIC_BOT_API_URL=https://corexdigital.de
npm run build

echo "[deploy] Backend: install deps (optional, if needed)..."
cd "$REPO_ROOT/backend"
if [ -f requirements.txt ]; then
  python3 -m pip install -q -r requirements.txt --user 2>/dev/null || true
fi

echo "[deploy] Restarting backend (PM2)..."
pm2 restart corex-backend --update-env || { echo "Warning: pm2 restart failed. Is corex-backend defined?"; }
pm2 save 2>/dev/null || true

echo "[deploy] Done. Nginx root: $REPO_ROOT/frontend/build"
