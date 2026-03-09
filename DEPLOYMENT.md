# Production Deployment - corexdigital.de

## Server layout (Ubuntu, nginx, pm2)

- Repo: `/var/www/corex-website`
- Frontend build: `/var/www/corex-website/frontend/build` (served by nginx)
- Backend: PM2 process `corex-backend` (uvicorn on port 8000)

## One-time setup on server

### 1. Clone and build

```bash
cd /var/www
git clone <your-repo-url> corex-website
cd corex-website
```

### 2. Backend

```bash
cd /var/www/corex-website/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.production.example .env   # or create .env manually
# Edit backend/.env: MONGO_URL, CORS_ORIGINS, and optionally OPENAI_API_KEY for Project Check AI.
```

Backend loads `backend/.env` at startup (python-dotenv), so no need to export vars in the shell. Under PM2, after changing `.env`, run `pm2 restart corex-backend --update-env` so the process restarts and re-reads the file.

### 3. PM2 backend

```bash
cd /var/www/corex-website/backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8000" --name corex-backend
pm2 save
pm2 startup
```

### 4. Frontend build

```bash
cd /var/www/corex-website/frontend
npm ci
REACT_APP_API_URL=https://corexdigital.de REACT_APP_BOT_API_URL=https://corexdigital.de npm run build
```

### 5. Nginx

```bash
sudo cp /var/www/corex-website/nginx.conf /etc/nginx/sites-available/corexdigital.de
sudo ln -sf /etc/nginx/sites-available/corexdigital.de /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 6. HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d corexdigital.de -d www.corexdigital.de
```

## Deploy after each git push

From repo root on server:

```bash
cd /var/www/corex-website
./scripts/deploy.sh
```

Or manually:

```bash
cd /var/www/corex-website
git pull
cd frontend && npm ci && REACT_APP_API_URL=https://corexdigital.de REACT_APP_BOT_API_URL=https://corexdigital.de npm run build
cd ../backend && pm2 restart corex-backend --update-env
pm2 save
```

## PM2

- Backend only: `pm2 restart corex-backend`
- Save process list: `pm2 save`
- Restore after reboot: `pm2 startup` (run the command it prints once)
- Logs: `pm2 logs corex-backend`

## Environment

- Backend `.env` must include `OPENAI_API_KEY` for Project Check AI. If missing, regex fallback is used.
- Frontend build uses `REACT_APP_API_URL=https://corexdigital.de` and `REACT_APP_BOT_API_URL=https://corexdigital.de` so API calls go to the same domain.
