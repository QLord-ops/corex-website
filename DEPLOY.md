# Деплой на corexdigital.de

## Вариант 1: Vercel (Frontend) + Railway/Render (Backend) — Рекомендуется

### Frontend на Vercel

1. **Установите Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Войдите в Vercel:**
   ```bash
   vercel login
   ```

3. **Деплой фронтенда:**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Настройте домен в Vercel Dashboard:**
   - Зайдите на vercel.com
   - Выберите проект
   - Settings → Domains
   - Добавьте `corexdigital.de` и `www.corexdigital.de`
   - Настройте DNS записи (A или CNAME) как указано в Vercel

5. **Установите переменную окружения:**
   - Settings → Environment Variables
   - `REACT_APP_API_URL` = `https://api.corexdigital.de`

### Backend на Railway или Render

#### Railway (railway.app)

1. Создайте аккаунт на railway.app
2. New Project → Deploy from GitHub
3. Выберите репозиторий
4. Добавьте сервис MongoDB (Railway предоставляет)
5. Настройте переменные окружения:
   - `MONGO_URL` (Railway предоставит для MongoDB сервиса)
   - `DB_NAME` = `corex`
   - `CORS_ORIGINS` = `https://corexdigital.de,https://www.corexdigital.de`
6. Railway автоматически создаст домен типа `your-app.up.railway.app`
7. Настройте кастомный домен `api.corexdigital.de`:
   - Settings → Domains → Add Custom Domain
   - Настройте DNS: CNAME `api` → `your-app.up.railway.app`

#### Render (render.com)

1. Создайте аккаунт на render.com
2. New → Web Service
3. Подключите GitHub репозиторий
4. Настройки:
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3
5. Добавьте MongoDB (New → MongoDB)
6. Переменные окружения:
   - `MONGO_URL` (Render предоставит)
   - `DB_NAME` = `corex`
   - `CORS_ORIGINS` = `https://corexdigital.de,https://www.corexdigital.de`
7. Настройте кастомный домен `api.corexdigital.de`

---

## Вариант 2: VPS (Ubuntu/Debian) с Docker

### Требования
- VPS с Ubuntu 20.04+ или Debian 11+
- Минимум 2GB RAM, 20GB диска
- Домен `corexdigital.de` настроен на IP сервера

### Шаги

1. **Подключитесь к серверу:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Установите Docker и Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Установите Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx -y
   ```

4. **Клонируйте репозиторий:**
   ```bash
   git clone your-repo-url /var/www/corexdigital.de
   cd /var/www/corexdigital.de
   ```

5. **Соберите фронтенд:**
   ```bash
   cd frontend
   yarn install
   REACT_APP_API_URL=https://api.corexdigital.de yarn build
   ```

6. **Настройте переменные окружения бэкенда:**
   ```bash
   cd ../backend
   nano .env
   ```
   Добавьте:
   ```
   MONGO_URL=mongodb://mongo:27017
   DB_NAME=corex
   CORS_ORIGINS=https://corexdigital.de,https://www.corexdigital.de
   ```

7. **Запустите Docker Compose:**
   ```bash
   cd /var/www/corexdigital.de
   docker-compose up -d
   ```

8. **Настройте Nginx:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/corexdigital.de
   sudo ln -s /etc/nginx/sites-available/corexdigital.de /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

9. **Получите SSL сертификат:**
   ```bash
   sudo certbot --nginx -d corexdigital.de -d www.corexdigital.de
   ```

10. **Настройте DNS записи:**
    - A запись: `@` → IP сервера
    - A запись: `www` → IP сервера
    - A запись: `api` → IP сервера (или CNAME на основной домен)

---

## Вариант 3: Только Vercel (Frontend + Serverless Functions)

Если хотите всё на Vercel, можно переписать бэкенд на Serverless Functions.

---

## Проверка деплоя

1. **Frontend:** https://corexdigital.de
2. **Backend API:** https://api.corexdigital.de/api/
3. **Health check:** https://api.corexdigital.de/api/status

---

## Обновление

После изменений в коде:

**Vercel:**
```bash
cd frontend && vercel --prod
```

**Railway/Render:**
Автоматически через GitHub (если настроен auto-deploy)

**VPS:**
```bash
cd /var/www/corexdigital.de
git pull
cd frontend && yarn build
docker-compose restart backend
```

---

## Troubleshooting

- **CORS ошибки:** Проверьте `CORS_ORIGINS` в переменных окружения бэкенда
- **API не отвечает:** Проверьте логи бэкенда и доступность MongoDB
- **Frontend не загружается:** Проверьте `REACT_APP_API_URL` в переменных окружения
