# 🚀 Быстрый деплой на corexdigital.de

## Самый простой способ (5 минут)

### 1. Frontend на Vercel (бесплатно)

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите
vercel login

# Деплой
cd frontend
vercel --prod
```

**В Vercel Dashboard:**
- Settings → Domains → Добавьте `corexdigital.de` и `www.corexdigital.de`
- Settings → Environment Variables → Добавьте:
  - `REACT_APP_API_URL` = `https://api.corexdigital.de`

**DNS настройки** (у вашего регистратора домена):
- A запись: `@` → IP из Vercel (или CNAME на vercel-dns)
- CNAME: `www` → cname.vercel-dns.com

---

### 2. Backend на Railway (бесплатно до 5$ в месяц)

1. Зайдите на [railway.app](https://railway.app) и войдите через GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Выберите ваш репозиторий
4. Railway автоматически определит Python проект
5. **Add Service** → **Database** → **MongoDB**
6. В настройках вашего сервиса добавьте переменные:
   ```
   MONGO_URL = <скопируйте из MongoDB сервиса>
   DB_NAME = corex
   CORS_ORIGINS = https://corexdigital.de,https://www.corexdigital.de
   ```
7. **Settings** → **Domains** → **Generate Domain** (получите `xxx.up.railway.app`)
8. **Add Custom Domain** → `api.corexdigital.de`
9. Railway покажет DNS настройки для `api` поддомена

**DNS настройки:**
- CNAME: `api` → `xxx.up.railway.app`

---

### 3. Проверка

- ✅ Frontend: https://corexdigital.de
- ✅ Backend: https://api.corexdigital.de/api/
- ✅ Health: https://api.corexdigital.de/api/status

---

## Альтернатива: Всё на одном VPS

Если у вас есть VPS (например, от Hetzner, DigitalOcean, AWS):

1. **Подключитесь к серверу:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Установите Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   ```

3. **Клонируйте репозиторий:**
   ```bash
   git clone your-repo /var/www/corexdigital.de
   cd /var/www/corexdigital.de
   ```

4. **Соберите фронтенд:**
   ```bash
   cd frontend
   yarn install
   REACT_APP_API_URL=https://api.corexdigital.de yarn build
   ```

5. **Запустите бэкенд и MongoDB:**
   ```bash
   cd ..
   docker-compose up -d
   ```

6. **Установите Nginx:**
   ```bash
   apt install nginx certbot python3-certbot-nginx -y
   cp nginx.conf /etc/nginx/sites-available/corexdigital.de
   ln -s /etc/nginx/sites-available/corexdigital.de /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

7. **SSL сертификат:**
   ```bash
   certbot --nginx -d corexdigital.de -d www.corexdigital.de
   ```

8. **DNS:**
   - A: `@` → IP сервера
   - A: `www` → IP сервера  
   - A: `api` → IP сервера

---

## Нужна помощь?

Смотрите подробную инструкцию в `DEPLOY.md`
