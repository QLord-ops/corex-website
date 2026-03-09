# Project Check Chat API – local test

Minimal curl test (backend must be running on port 8000, `OPENAI_API_KEY` in `backend/.env`):

```bash
curl -X POST http://127.0.0.1:8000/api/project-check/chat \
  -H "Content-Type: application/json" \
  -d '{
    "intake": {"language": "en", "rawText": "Marketplace with KYC and Stripe Connect"},
    "messages": [{"role": "user", "content": "what price?"}],
    "newMessage": "what price?"
  }'
```

**Expected 200 (OpenAI configured, success):**
```json
{"assistantMessage": "For a marketplace with KYC and Stripe Connect we'd typically recommend..."}
```

**Expected 503 (no key):**
```json
{"detail": "OpenAI is not configured"}
```

**Expected 502 (OpenAI upstream error):**
```json
{"detail": "OpenAI upstream error"}
```

Check server logs for `[chat]` lines: key_detected, payload, raw response, and any exceptions.
