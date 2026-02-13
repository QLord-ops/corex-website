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
# Clean old build and cache
rm -rf build node_modules/.cache 2>/dev/null || true
npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund
export REACT_APP_API_URL=https://corexdigital.de
export REACT_APP_BOT_API_URL=https://corexdigital.de
npm run build
# Verify build was created
if [ ! -f "build/index.html" ]; then
  echo "ERROR: Build failed - index.html not found!"
  exit 1
fi
echo "[deploy] Frontend build completed successfully"

echo "[deploy] Backend: install deps (optional, if needed)..."
cd "$REPO_ROOT/backend"
if [ -f requirements.txt ]; then
  python3 -m pip install -q -r requirements.txt --user 2>/dev/null || true
fi

echo "[deploy] Restarting backend (PM2)..."
pm2 restart corex-backend --update-env || { echo "Warning: pm2 restart failed. Is corex-backend defined?"; }
pm2 save 2>/dev/null || true

echo "[deploy] Reloading nginx..."
sudo rm -rf /var/cache/nginx/* 2>/dev/null || true
sudo nginx -t && sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || echo "Warning: nginx reload failed - run manually"

echo "[deploy] Done. Nginx root: $REPO_ROOT/frontend/build"
