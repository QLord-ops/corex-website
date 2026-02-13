# 🚀 Quick Deploy to Server

## Changes Pushed Successfully ✅

All changes have been pushed to `main` branch.

## Deploy Commands (Run on Server)

### Option 1: Using Deploy Script (Recommended)

```bash
cd /var/www/corex-website
git pull
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Option 2: Manual Deploy

```bash
cd /var/www/corex-website
git pull

# Frontend build
cd frontend
npm ci
export REACT_APP_API_URL=https://corexdigital.de
export NEXT_PUBLIC_BOT_API_URL=https://corexdigital.de
npm run build

# Backend restart
cd ../backend
pm2 restart corex-backend --update-env
pm2 save
```

## Backend Environment Setup

Make sure `backend/.env` has:

```bash
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=https://corexdigital.de,https://www.corexdigital.de
NODE_ENV=production
```

## Post-Deploy Verification

1. **Check site loads:**
   ```bash
   curl -I https://corexdigital.de
   ```

2. **Check bot API:**
   ```bash
   curl -X POST https://corexdigital.de/api/extract \
     -H "Content-Type: application/json" \
     -d '{"currentIntake": {}, "userMessage": "Test"}'
   ```

3. **Check bot on site:**
   - Visit https://corexdigital.de
   - Scroll to bot section
   - Test "Kosten berechnen" button

## If Bot Shows Error

1. Check backend is running:
   ```bash
   pm2 status
   pm2 logs corex-backend
   ```

2. Check CORS allows your domain:
   ```bash
   grep ALLOWED_ORIGINS backend/.env
   ```

3. Check frontend build has NEXT_PUBLIC_BOT_API_URL:
   ```bash
   grep NEXT_PUBLIC_BOT_API_URL frontend/build/static/js/*.js | head -1
   ```

## Quick Fixes

### Bot not loading?
- Rebuild frontend with `NEXT_PUBLIC_BOT_API_URL`
- Restart backend: `pm2 restart corex-backend`

### CORS errors?
- Update `backend/.env`: `ALLOWED_ORIGINS=https://corexdigital.de,https://www.corexdigital.de`
- Restart backend: `pm2 restart corex-backend --update-env`

### Backend not starting?
- Check logs: `pm2 logs corex-backend`
- Check Python: `python3 --version`
- Check dependencies: `pip3 install -r backend/requirements.txt`
