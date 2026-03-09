# Google Search Console & SEO Setup Guide

## ✅ Completed Changes

### 1. Google Search Console Verification Meta Tag
- **File:** `frontend/public/index.html`
- **Location:** Added after robots meta tag
- **Status:** Placeholder added - **ACTION REQUIRED**

### 2. Sitemap.xml
- **File:** `frontend/public/sitemap.xml`
- **Status:** ✅ Updated with:
  - Correct domain: `https://corexdigital.de`
  - All public routes: `/`, `/consultation`
  - Proper hreflang tags for DE/EN
  - Last modified date: 2026-02-12
- **Accessibility:** ✅ Available at `/sitemap.xml` (served from `public/` folder)

### 3. Robots.txt
- **File:** `frontend/public/robots.txt`
- **Status:** ✅ Updated with:
  - Correct sitemap URL: `https://corexdigital.de/sitemap.xml`
  - Disallow rules for private routes (`/builder/`, `/api/`)
  - Allow rules for public routes (`/`, `/consultation`, `/s/`)
- **Accessibility:** ✅ Available at `/robots.txt`

### 4. Domain Updates
- **Files:** `frontend/public/index.html`
- **Status:** ✅ Updated all references from `corex.de` to `corexdigital.de`:
  - Open Graph URLs
  - Twitter Card URLs
  - Canonical URL
  - Hreflang tags
  - JSON-LD structured data

---

## 🔧 Required Actions

### Step 1: Add Google Search Console Verification Code

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://corexdigital.de`
3. Choose verification method: **HTML tag**
4. Copy the verification code (format: `abc123xyz...`)
5. Edit `frontend/public/index.html`:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
   Replace `YOUR_VERIFICATION_CODE` with your actual code
6. Rebuild and deploy

### Step 2: Submit Sitemap to Google Search Console

After verification:
1. Go to Google Search Console → Sitemaps
2. Enter: `sitemap.xml`
3. Click "Submit"

### Step 3: Verify Files Are Accessible

After deployment, verify:
- ✅ `https://corexdigital.de/robots.txt` - Should show robots.txt content
- ✅ `https://corexdigital.de/sitemap.xml` - Should show XML sitemap
- ✅ `https://corexdigital.de/` - Should have verification meta tag in `<head>`

---

## 📦 Build & Deploy Commands

### Local Build Test
```bash
cd frontend
npm install  # or yarn install
npm run build  # or yarn build
```

### Verify Build Output
```bash
# Check that sitemap.xml and robots.txt are in build folder
ls frontend/build/sitemap.xml
ls frontend/build/robots.txt

# Check index.html has verification tag
grep "google-site-verification" frontend/build/index.html
```

### Deployment

**For Vercel:**
```bash
cd frontend
vercel --prod
```

**For VPS/Docker:**
```bash
cd frontend
npm run build
# Copy build/ folder to web server
```

---

## 📋 Files Modified

1. ✅ `frontend/public/index.html`
   - Added Google Search Console verification meta tag
   - Updated all domain references to `corexdigital.de`

2. ✅ `frontend/public/sitemap.xml`
   - Updated domain to `corexdigital.de`
   - Added `/consultation` route
   - Added proper hreflang tags

3. ✅ `frontend/public/robots.txt`
   - Updated sitemap URL to `corexdigital.de`
   - Added disallow rules for `/builder/` routes
   - Updated domain references

---

## 🔍 Post-Deployment Checklist

- [ ] Verify `https://corexdigital.de/robots.txt` is accessible
- [ ] Verify `https://corexdigital.de/sitemap.xml` is accessible
- [ ] Add Google Search Console verification code
- [ ] Verify site in Google Search Console
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Request indexing for main pages:
  - `https://corexdigital.de/`
  - `https://corexdigital.de/consultation`
- [ ] Monitor indexing status in Google Search Console

---

## 🚀 Final Deployment Steps

1. **Add verification code** to `index.html`
2. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```
3. **Deploy** (Vercel/Railway/VPS)
4. **Verify** files are accessible
5. **Submit** to Google Search Console
6. **Monitor** indexing progress

---

## 📊 Expected Results

After setup:
- ✅ Google Search Console shows verified site
- ✅ Sitemap submitted and processed
- ✅ Pages indexed within 1-7 days
- ✅ Search results show correct meta descriptions
- ✅ Structured data validated

---

## ⚠️ Notes

- **Builder routes** (`/builder/*`) are excluded from indexing (private)
- **API routes** (`/api/*`) are excluded from indexing
- **Client sites** (`/s/*`) are allowed but dynamic (not in sitemap)
- **Sitemap** will auto-update when you rebuild (update `lastmod` dates)
