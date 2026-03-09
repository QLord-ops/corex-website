# 🔧 Исправление: Nginx отдает старые файлы

## Проблема
- Файл `build/index.html` обновлен (Feb 13 16:04)
- Но сайт показывает `Last-Modified: Thu, 12 Feb 2026 16:02:36 GMT`
- Nginx не отдает новые файлы

## Решение

### 1. Проверить что nginx использует правильный root

```bash
# Проверить конфигурацию nginx
sudo cat /etc/nginx/sites-enabled/corexdigital.de | grep -A 2 "root"

# Должно быть:
# root /var/www/corex-website/frontend/build;
```

### 2. Проверить что файлы действительно в правильной директории

```bash
# Проверить что файл существует и свежий
ls -la /var/www/corex-website/frontend/build/index.html

# Проверить содержимое файла (должен быть бот)
grep -i "consultation\|bot\|kosten" /var/www/corex-website/frontend/build/index.html | head -3
```

### 3. Полный перезапуск nginx (не reload)

```bash
# Остановить nginx
sudo systemctl stop nginx

# Очистить все кеши
sudo rm -rf /var/cache/nginx/*
sudo rm -rf /var/lib/nginx/cache/*

# Запустить nginx
sudo systemctl start nginx

# Проверить статус
sudo systemctl status nginx
```

### 4. Проверить права доступа

```bash
# Убедиться что nginx может читать файлы
sudo chown -R www-data:www-data /var/www/corex-website/frontend/build
sudo chmod -R 755 /var/www/corex-website/frontend/build

# Проверить что nginx процесс может читать
sudo -u www-data test -r /var/www/corex-website/frontend/build/index.html && echo "OK" || echo "FAIL"
```

### 5. Проверить нет ли CDN или прокси перед nginx

```bash
# Проверить заголовки ответа
curl -I https://corexdigital.de

# Проверить нет ли Cloudflare или другого CDN
curl -I https://corexdigital.de | grep -i "cf-\|cloudflare\|cdn"
```

### 6. Принудительно обновить конфигурацию nginx

```bash
# Скопировать конфигурацию заново
sudo cp /var/www/corex-website/nginx.conf /etc/nginx/sites-available/corexdigital.de

# Проверить синтаксис
sudo nginx -t

# Перезапустить полностью
sudo systemctl restart nginx
```

## Полная последовательность команд:

```bash
cd /var/www/corex-website

# 1. Проверить что файлы свежие
ls -la frontend/build/index.html

# 2. Проверить конфигурацию nginx
sudo cat /etc/nginx/sites-enabled/corexdigital.de | grep root

# 3. Обновить конфигурацию если нужно
sudo cp nginx.conf /etc/nginx/sites-available/corexdigital.de
sudo nginx -t

# 4. Очистить все кеши
sudo rm -rf /var/cache/nginx/*
sudo rm -rf /var/lib/nginx/cache/*

# 5. Полный перезапуск nginx
sudo systemctl restart nginx

# 6. Проверить что файлы доступны
sudo -u www-data test -r /var/www/corex-website/frontend/build/index.html && echo "OK" || echo "FAIL"

# 7. Проверить заголовки
curl -I https://corexdigital.de | grep Last-Modified
```

## Если все еще не работает

### Проверить что nginx действительно читает правильный файл:

```bash
# Посмотреть какой файл nginx отдает
sudo strace -p $(pgrep -f "nginx: worker") -e trace=openat 2>&1 | grep index.html

# Или проверить логи
sudo tail -f /var/log/nginx/access.log
```

### Проверить нет ли нескольких конфигураций:

```bash
# Найти все конфигурации для этого домена
sudo grep -r "corexdigital.de" /etc/nginx/

# Убедиться что используется правильная
ls -la /etc/nginx/sites-enabled/
```

### Альтернатива: временно отключить кеширование в nginx

Добавить в конфигурацию nginx (в секцию `location /`):
```nginx
add_header Cache-Control "no-cache, no-store, must-revalidate";
add_header Pragma "no-cache";
add_header Expires "0";
```

Затем:
```bash
sudo cp /var/www/corex-website/nginx.conf /etc/nginx/sites-available/corexdigital.de
sudo nginx -t && sudo systemctl restart nginx
```
