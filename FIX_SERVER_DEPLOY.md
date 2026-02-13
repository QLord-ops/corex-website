# 🔧 Исправление проблем на сервере

## Проблема 1: Git pull не работает (локальные изменения)

На сервере есть незакоммиченные изменения. Нужно их сохранить или отменить.

### Решение A: Сохранить изменения (stash)

```bash
cd /var/www/corex-website
git stash
git pull
git stash pop  # Вернуть изменения обратно (если нужны)
```

### Решение B: Отменить локальные изменения (если не нужны)

```bash
cd /var/www/corex-website
git checkout -- backend/requirements.txt frontend/package-lock.json frontend/package.json
git pull
```

### Решение C: Принудительно обновить (если локальные изменения не важны)

```bash
cd /var/www/corex-website
git reset --hard origin/main
git pull
```

## Проблема 2: Скрипт deploy.sh не найден

Скрипт должен быть в репозитории. Проверьте:

```bash
cd /var/www/corex-website
ls -la scripts/
```

Если папки `scripts` нет или файла `deploy.sh` нет, создайте вручную:

```bash
cd /var/www/corex-website
mkdir -p scripts
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash
# Production deploy for corexdigital.de (Ubuntu, nginx, pm2)
set -e
cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

echo "[deploy] Pulling latest..."
git pull

echo "[deploy] Frontend: install and build..."
cd "$REPO_ROOT/frontend"
npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund
export REACT_APP_API_URL=https://corexdigital.de
export NEXT_PUBLIC_BOT_API_URL=https://corexdigital.de
npm run build

echo "[deploy] Backend: install deps..."
cd "$REPO_ROOT/backend"
if [ -f requirements.txt ]; then
  python3 -m pip install -q -r requirements.txt --user 2>/dev/null || true
fi

echo "[deploy] Restarting backend (PM2)..."
pm2 restart corex-backend --update-env || { echo "Warning: pm2 restart failed. Is corex-backend defined?"; }
pm2 save 2>/dev/null || true

echo "[deploy] Done. Nginx root: $REPO_ROOT/frontend/build"
EOF

chmod +x scripts/deploy.sh
```

## Полная последовательность команд для исправления:

```bash
# 1. Перейти в директорию проекта
cd /var/www/corex-website

# 2. Сохранить или отменить локальные изменения
git stash  # или git reset --hard origin/main

# 3. Обновить код
git pull

# 4. Убедиться что скрипт существует
ls -la scripts/deploy.sh

# 5. Если скрипта нет - создать (см. выше)

# 6. Запустить деплой
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Альтернатива: Ручной деплой без скрипта

Если скрипт не работает, выполните вручную:

```bash
cd /var/www/corex-website
git stash  # или git reset --hard origin/main
git pull

# Frontend
cd frontend
npm ci
export REACT_APP_API_URL=https://corexdigital.de
export NEXT_PUBLIC_BOT_API_URL=https://corexdigital.de
npm run build

# Backend
cd ../backend
pm2 restart corex-backend --update-env
pm2 save
```

## Проверка после деплоя

```bash
# Проверить что бэкенд работает
pm2 status
pm2 logs corex-backend --lines 20

# Проверить что фронтенд собран
ls -la frontend/build/index.html

# Проверить API
curl -X POST http://localhost:8000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"currentIntake": {}, "userMessage": "Test"}'
```
