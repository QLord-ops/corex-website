# Production checklist – what changed and why

## A) Indexing / SEO

| File | Change | Why |
|------|--------|-----|
| `frontend/public/sitemap.xml` | Added all public URLs: `/`, `/leistungen`, `/ueber-uns`, `/kontakt`, `/consultation`, `/en` and variants; hreflang de, en, x-default | GSC had only 1 URL; now all public pages are discoverable |
| `frontend/public/robots.txt` | UTF-8 only, no comments with special chars; `Sitemap: https://corexdigital.de/sitemap.xml`; Allow public paths; Disallow /api/, /admin/, /builder/ | Valid robots, correct domain, crawlable public pages |
| `frontend/src/App.js` | Routes for `/leistungen`, `/ueber-uns`, `/kontakt`, `/en`, `/en/leistungen`, `/en/ueber-uns`, `/en/kontakt` (all render MainSite) | Sitemap URLs must be valid; SPA serves same app for these paths |
| `frontend/public/index.html` | OG/Twitter image URLs set to `https://corexdigital.de/og/og-image.jpg` and `.../og/twitter-image.jpg`; LocalBusiness JSON-LD added | OG images in `public/og/`; structured data for local business |
| `frontend/public/og/README.txt` | Placeholder note for placing `og-image.jpg` and `twitter-image.jpg` (1200x630) | No binaries added; you add the files |

Canonical and hreflang are in `index.html` (de, en, x-default). For this SPA, the initial document is the same for all routes.

---

## B) Performance (PageSpeed / LCP)

| File | Change | Why |
|------|--------|-----|
| `frontend/public/index.html` | PostHog and GA (gtag) moved into `runAfterLoad()` so they run after `window.load` | Removes render-blocking scripts; improves LCP |
| `frontend/public/index.html` | PostHog snippet shortened (only used methods kept) | Less parsing before load |
| Emergent script | Already `defer` | No change |
| Fonts | Already preconnect + preload + async style | No change |

Heavy background animation is already reduced on mobile via `shouldReduceAnimations()` and `LivingSystemBackground` (fewer nodes, 30 fps). Hero text is plain HTML in the initial bundle; no change.

---

## C) Deployment pipeline

| File | Change | Why |
|------|--------|-----|
| `scripts/deploy.sh` | New script: `git pull`, `npm ci` in frontend, `REACT_APP_API_URL=... npm run build`, `pm2 restart corex-backend`, `pm2 save` | Single command to deploy after push |
| `DEPLOYMENT.md` | New: one-time setup, deploy command, PM2, nginx, HTTPS, env vars | Copy-paste server instructions |

Frontend is static (nginx serves `frontend/build`). Only the backend is run with PM2.

---

## D) Backend – Project Check (OpenAI)

| File | Change | Why |
|------|--------|-----|
| `backend/server.py` | In-memory rate limit (30 req/min per IP) for `/api/extract` and new `/api/project-check/analyze` | Limit abuse |
| `backend/server.py` | `POST /api/project-check/analyze`: body `{ "text", "currentIntake" }`, returns same shape as `/extract`; uses same OpenAI + regex fallback | Requested endpoint; backward compatible |
| `backend/server.py` | Validation: message length ≤ 10000; 429 on rate limit; 500 with try/except on analyze | Validation and error handling |

Existing `POST /api/extract` unchanged for the frontend; it now has rate limiting and validation. Frontend keeps calling `/extract`.

---

## E) Build fixes

| File | Change | Why |
|------|--------|-----|
| `frontend/package.json` | `react` / `react-dom`: ^19 → ^18.2; `react-router-dom`: ^7.5 → ^6.28; `date-fns`: ^4.1 → ^3.6 | react-day-picker supports React 16–18 and date-fns 2/3; avoid peer/force installs |
| `frontend/src/components/scenes/SceneEntry.jsx` | Already fixed earlier: all `useTransform` calls unconditional; condition only on computed values | React hooks rules |

After these changes, run `npm install` and `npm run build` in `frontend` (no `--force` or `--legacy-peer-deps`). If your lockfile still had React 19, run `rm -rf node_modules package-lock.json && npm install` once to get React 18, then `npm run build`.

---

## F) Nginx

| File | Change | Why |
|------|--------|-----|
| `nginx.conf` | `root /var/www/corex-website/frontend/build`; `location /api/` → `proxy_pass http://127.0.0.1:8000`; gzip for js/json/css/xml/plain; Cache-Control for `/static/` and hashed assets (1y), HTML (0, must-revalidate); `/robots.txt` and `/sitemap.xml` cache 24h | Correct paths, API proxy, compression, caching for static and API |

HTTPS and certbot commands are documented in `DEPLOYMENT.md`.

---

## Commands to run on the server

```bash
cd /var/www/corex-website
git pull
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

If nginx isn’t configured yet:

```bash
sudo cp /var/www/corex-website/nginx.conf /etc/nginx/sites-available/corexdigital.de
sudo ln -sf /etc/nginx/sites-available/corexdigital.de /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

HTTPS (if not already):

```bash
sudo certbot --nginx -d corexdigital.de -d www.corexdigital.de
```

---

## Verification

| URL | Expected |
|-----|----------|
| https://corexdigital.de/robots.txt | `Sitemap: https://corexdigital.de/sitemap.xml`, Allow/Disallow, UTF-8 text |
| https://corexdigital.de/sitemap.xml | XML with multiple `<url>` (/, /leistungen, /ueber-uns, /kontakt, /consultation, /en) |
| https://corexdigital.de/api/ | Backend root (e.g. `{"message":"Hello World"}`) |
| https://corexdigital.de/api/status | Backend status list (GET) |
| Backend Swagger | On server: `curl http://127.0.0.1:8000/docs` (or add nginx proxy for /docs if needed) |
| https://corexdigital.de/ | Homepage loads |
| https://corexdigital.de/consultation | Project Check page |
| https://corexdigital.de/leistungen | Same app (main site) |
