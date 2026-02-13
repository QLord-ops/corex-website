# Localhost Development Setup

## Quick Start

### 1. Backend (Port 8000)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file (or use existing)
# For localhost, CORS is automatically configured

# Start backend
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: `http://localhost:8000`

### 2. Frontend (Port 3000)

```bash
cd frontend
npm install

# Start development server
npm start
```

Frontend will be available at: `http://localhost:3000`

### 3. Bot Configuration

**For localhost development:**
- No `NEXT_PUBLIC_BOT_API_URL` needed
- Bot automatically uses `http://localhost:8000` when running on localhost
- CORS is automatically configured to allow `http://localhost:3000`

**For production:**
- Set `NEXT_PUBLIC_BOT_API_URL=https://bot.yourdomain.com` during build

## Troubleshooting

### Bot shows "Bot API URL is not configured"
- Make sure backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify backend CORS allows `http://localhost:3000`

### CORS errors in browser
- Backend automatically allows localhost origins in development
- If `ALLOWED_ORIGINS` is set, it will override - remove it for localhost dev
- Restart backend after changing CORS settings

### API requests fail
- Check backend is running: `curl http://localhost:8000/api/status`
- Check backend logs for errors
- Verify port 8000 is not blocked by firewall

## Testing Bot Locally

1. Open `http://localhost:3000`
2. Scroll to bot section
3. Enter test message: "Ich brauche eine Website"
4. Click "Kosten berechnen"
5. Should see results without errors

## Environment Variables

### Backend (.env)
```bash
# Optional for localhost - OpenAI for better extraction
OPENAI_API_KEY=sk-...

# Don't set ALLOWED_ORIGINS for localhost - it will auto-allow localhost
# ALLOWED_ORIGINS=...  # Only set for production
```

### Frontend
```bash
# Not needed for localhost - auto-detects localhost:8000
# NEXT_PUBLIC_BOT_API_URL=...  # Only set for production build
```
