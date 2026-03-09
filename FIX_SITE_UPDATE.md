# 🔧 Исправление: сайт не обновился

## Проблема
- `Last-Modified: Thu, 12 Feb 2026 16:02:36 GMT` (вчера)
- Бот не виден на сайте
- Фронтенд не обновился

## Решение на сервере

### 1. Пересобрать фронтенд с новыми изменениями

```bash
cd /var/www/corex-website

# Убедиться что код обновлен
git pull

# Перейти в frontend
cd frontend

# Очистить старый build (важно!)
rm -rf build
rm -rf node_modules/.cache

# Установить зависимости
npm ci

# Собрать с правильными ENV переменными
export REACT_APP_API_URL=https://corexdigital.de
export NEXT_PUBLIC_BOT_API_URL=https://corexdigital.de
npm run build

# Проверить что build создан
ls -la build/index.html
```

### 2. Проверить что nginx указывает на правильную директорию

```bash
# Проверить конфигурацию nginx
cat /etc/nginx/sites-available/corexdigital.de | grep root

# Должно быть:
# root /var/www/corex-website/frontend/build;
```

### 3. Очистить кеш nginx и перезагрузить

```bash
# Очистить кеш nginx
sudo rm -rf /var/cache/nginx/*

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить nginx
sudo systemctl reload nginx
# ИЛИ
sudo service nginx reload
```

### 4. Проверить права доступа

```bash
# Убедиться что nginx может читать файлы
sudo chown -R www-data:www-data /var/www/corex-website/frontend/build
sudo chmod -R 755 /var/www/corex-website/frontend/build
```

### 5. Проверить что файлы обновились

```bash
# Проверить дату модификации index.html
ls -la /var/www/corex-website/frontend/build/index.html

# Должна быть сегодняшняя дата

# Проверить что бот есть в build
grep -r "ConsultationBot" /var/www/corex-website/frontend/build/static/js/ | head -1
```

## Полная последовательность команд (скопируйте и выполните):

```bash
cd /var/www/corex-website
git pull
cd frontend
rm -rf build node_modules/.cache
npm ci
export REACT_APP_API_URL=https://corexdigital.de
export NEXT_PUBLIC_BOT_API_URL=https://corexdigital.de
npm run build
sudo rm -rf /var/cache/nginx/*
sudo nginx -t && sudo systemctl reload nginx
ls -la build/index.html
```

## Проверка после обновления

```bash
# Проверить заголовки (Last-Modified должна быть сегодня)
curl -I https://corexdigital.de | grep Last-Modified

# Проверить что бот есть в HTML
curl https://corexdigital.de | grep -i "consultation\|bot\|kosten berechnen" | head -5
```

## Если все еще не работает

### Проверить что nginx использует правильный root:

```bash
sudo cat /etc/nginx/sites-enabled/corexdigital.de | grep -A 5 "server {"
```

Должно быть:
```nginx
root /var/www/corex-website/frontend/build;
```

Если нет - обновить конфигурацию:
```bash
sudo cp /var/www/corex-website/nginx.conf /etc/nginx/sites-available/corexdigital.de
sudo nginx -t
sudo systemctl reload nginx
```

### Проверить логи nginx:

```bash
sudo tail -f /var/log/nginx/error.log
```

### Принудительно очистить браузерный кеш:

Откройте сайт с `Ctrl+F5` или `Cmd+Shift+R`
