# Bot Production Deployment Guide

## 1. Backend API Service (Bot Service)

### Required Environment Variables

Create `backend/.env` on the bot service:

```bash
# OpenAI API Key (required for AI extraction)
OPENAI_API_KEY=sk-...

# Environment
NODE_ENV=production

# CORS - Only allow your production domains
ALLOWED_ORIGINS=https://aionex.de,https://www.aionex.de

# KPI Stats API Key (random long key for /api/kpi/stats endpoint)
KPI_STATS_API_KEY=your-random-long-secure-key-here-min-32-chars

# Database path (if using SQLite)
DB_PATH=/data/bot.sqlite

# Optional: Calendly booking URL
BOOK_CALL_URL=https://calendly.com/your-username/meeting

# MongoDB (if using MongoDB instead of SQLite)
MONGO_URL=mongodb://localhost:27017
DB_NAME=corex
```

### CORS Configuration

The backend uses `CORS_ORIGINS` environment variable. Update `backend/server.py` if needed:

```python
allow_origins=os.environ.get('ALLOWED_ORIGINS', os.environ.get('CORS_ORIGINS', '*')).split(','),
```

### Post-Deployment Checks

#### 1. Check API endpoint responds:
```bash
curl -X POST https://bot.yourdomain.com/api/extract \
  -H "Content-Type: application/json" \
  -d '{"currentIntake": {}, "userMessage": "Test"}'
```

Expected: `200 OK` with `{"intake": {...}, "missing_required": [...]}`

#### 2. Check CORS allows only your domain:
```bash
curl -X OPTIONS https://bot.yourdomain.com/api/extract \
  -H "Origin: https://aionex.de" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected: `Access-Control-Allow-Origin: https://aionex.de`

Try with different origin:
```bash
curl -X OPTIONS https://bot.yourdomain.com/api/extract \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected: Should NOT include `Access-Control-Allow-Origin: https://evil.com` (or return CORS error)

#### 3. Check sessionId is returned:
**Note:** Currently sessionId is managed client-side via localStorage. Backend doesn't return sessionId in response.

To verify client-side session persistence:
1. Open browser DevTools → Application → Local Storage
2. Start conversation in bot
3. Check for `consultation_bot_session_id` key
4. Refresh page - session should persist

---

## 2. Frontend (Website)

### Required Environment Variables

Set during build time (not runtime):

```bash
REACT_APP_BOT_API_URL=https://bot.yourdomain.com
```

Or fallback to general API URL:
```bash
REACT_APP_API_URL=https://bot.yourdomain.com
```

### Build Command

```bash
cd frontend
REACT_APP_BOT_API_URL=https://bot.yourdomain.com npm run build
```

### Post-Deployment Checks

#### 1. Site loads:
- Visit `https://aionex.de`
- Check browser console for errors

#### 2. Scroll scenes work:
- Scroll through homepage
- Verify animations don't break
- Check mobile responsiveness

#### 3. Bot block is visible inline:
- Scroll to bot section (before final CTA)
- Bot should appear as normal section (not modal)
- Check it's visible on mobile

#### 4. Bot functionality:
- Click "Kosten berechnen" / "Calculate cost"
- Enter test message
- Verify request is sent
- Verify result is displayed

---

## 3. Smoke Tests (5 Scenarios)

### Test 1: German Language
**Input:**
```
Ich brauche eine Website für eine SMM-Agentur. Budget bis 3.000 €, Start in 4 Wochen.
```

**Expected:**
- Response in German
- Package recommendation
- Cost and timeline displayed

### Test 2: Russian Language
**Input:**
```
Хочу лендинг для услуг. Бюджет до 2.000 €.
```

**Expected:**
- Response in Russian
- Package recommendation
- Cost and timeline displayed

### Test 3: English Language
**Input:**
```
Need a small website for my consulting business. Budget up to €2,500.
```

**Expected:**
- Response in English
- Package recommendation
- Cost and timeline displayed

### Test 4: Step-by-Step Flow
1. Click "Schrittweise beantworten" / "Answer step by step"
2. Answer exactly 2 questions
3. Verify proposal is generated
4. Check all fields are filled correctly

### Test 5: Session Persistence
1. Start conversation
2. Send 1-2 messages
3. Refresh page (F5)
4. Verify session is restored
5. Verify messages are still visible

---

## 4. KPI Stats Endpoint Security

### Important: Never expose KPI key in frontend

The `/api/kpi/stats` endpoint should:
- Require `KPI_STATS_API_KEY` in request header
- Only be called from backend-to-backend or server-side
- Never be called directly from browser JavaScript

### Example secure implementation (to be added to backend/server.py):

```python
@api_router.post("/kpi/stats")
async def kpi_stats(request: Request):
    """KPI stats endpoint - requires API key authentication."""
    api_key = request.headers.get("X-API-Key")
    expected_key = os.environ.get("KPI_STATS_API_KEY")
    
    if not expected_key:
        raise HTTPException(status_code=503, detail="KPI stats not configured")
    
    if api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # TODO: Implement stats collection
    # Count from database/logs:
    # - analysis_completed: count of /extract calls
    # - proposal_generated: count of result screens shown
    # - lead_submitted: count of email link clicks
    
    return {
        "analysis_completed": 0,  # TODO: implement
        "proposal_generated": 0,  # TODO: implement
        "lead_submitted": 0       # TODO: implement
    }
```

**Note:** This endpoint needs to be implemented. Currently not present in backend.

### Frontend should NEVER include:
```javascript
// ❌ WRONG - Never do this
const apiKey = "your-key-here";
fetch('/api/kpi/stats', {
  headers: { 'X-API-Key': apiKey }
});
```

---

## 5. First 24 Hours Monitoring

### Key Metrics to Track

Monitor these 3 numbers:

1. **analysis_completed** - How many users completed the analysis
2. **proposal_generated** - How many proposals were generated
3. **lead_submitted** - How many leads were submitted (email clicks)

### If leads are low, optimize:

#### Don't change code, optimize:
- **Heading** - Test different headlines
- **Placeholder** - Make example more compelling
- **CTA** - Try different button text
- **Block order** - Move bot section higher/lower
- **Trust signals** - Add testimonials or guarantees

### Example monitoring query:

```python
# In your monitoring dashboard or logs
stats = {
    "analysis_completed": count_analyses_last_24h(),
    "proposal_generated": count_proposals_last_24h(),
    "lead_submitted": count_email_clicks_last_24h(),
    "conversion_rate": count_email_clicks_last_24h() / count_analyses_last_24h() * 100
}
```

---

## Quick Reference

### Backend ENV Checklist:
- [ ] `OPENAI_API_KEY` set
- [ ] `NODE_ENV=production`
- [ ] `ALLOWED_ORIGINS` contains only your domains
- [ ] `KPI_STATS_API_KEY` set (long random key)
- [ ] `DB_PATH` or `MONGO_URL` configured
- [ ] `BOOK_CALL_URL` set (if using)

### Frontend ENV Checklist:
- [ ] `REACT_APP_BOT_API_URL` set to bot service URL (or `REACT_APP_API_URL` as fallback)
- [ ] Build completed successfully
- [ ] No console errors

### Post-Deploy Verification:
- [ ] `/api/extract` returns 200
- [ ] `/api/project-check/analyze` returns 200 (alternative endpoint)
- [ ] CORS only allows your domain
- [ ] sessionId persists in localStorage (client-side)
- [ ] Site loads without errors
- [ ] Bot visible inline
- [ ] All 5 smoke tests pass

---

## Troubleshooting

### Bot not loading:
1. Check `NEXT_PUBLIC_BOT_API_URL` is set correctly
2. Check browser console for CORS errors
3. Verify bot service is accessible

### CORS errors:
1. Verify `ALLOWED_ORIGINS` includes your domain
2. Check no trailing slashes in domain list
3. Restart backend after changing CORS settings

### Session not persisting:
1. Check localStorage is enabled
2. Verify sessionId is generated correctly
3. Check browser console for errors

### Low conversion:
1. Check analytics for drop-off points
2. Test different headlines/CTAs
3. Review user feedback
4. A/B test different placements
