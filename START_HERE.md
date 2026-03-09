# 🎯 Начните здесь: Деплой corexdigital.de

## ✅ Что уже готово

Я создал все необходимые файлы для деплоя вашего сайта на домен **corexdigital.de**:

### Файлы для деплоя:
- ✅ `vercel.json` - конфигурация для Vercel (фронтенд)
- ✅ `frontend/vercel.json` - альтернативная конфигурация
- ✅ `backend/Dockerfile` - Docker образ для бэкенда
- ✅ `docker-compose.yml` - полный стек (бэкенд + MongoDB)
- ✅ `nginx.conf` - конфигурация Nginx для VPS
- ✅ `railway.json` - конфигурация для Railway
- ✅ `backend/Procfile` - команда запуска для Railway/Render
- ✅ `.env.production.example` - примеры переменных окружения

---

## 🚀 Быстрый старт (рекомендуется)

### Вариант A: Vercel + Railway (5 минут, бесплатно)

**1. Frontend на Vercel:**
```bash
npm i -g vercel
vercel login
cd frontend
vercel --prod
```
→ Добавьте домен `corexdigital.de` в Vercel Dashboard
→ Установите переменную: `REACT_APP_API_URL=https://api.corexdigital.de`

**2. Backend на Railway:**
1. Зайдите на [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Добавьте MongoDB сервис
4. Установите переменные окружения (см. `QUICK_DEPLOY.md`)
5. Добавьте кастомный домен `api.corexdigital.de`

**3. DNS настройки** (у регистратора домена):
- `@` → A запись на IP Vercel (или CNAME на vercel-dns)
- `www` → CNAME на cname.vercel-dns.com
- `api` → CNAME на ваш Railway домен

---

### Вариант B: Всё на VPS (если есть сервер)

Смотрите инструкцию в `DEPLOY.md` (раздел "Вариант 2: VPS")

---

## 📋 Чеклист перед деплоем

- [ ] Репозиторий загружен на GitHub
- [ ] Домен `corexdigital.de` куплен и доступен для настройки DNS
- [ ] Выбрана платформа хостинга (Vercel+Railway или VPS)
- [ ] Переменные окружения подготовлены (см. `.env.production.example`)

---

## 📚 Документация

- **`QUICK_DEPLOY.md`** - краткая инструкция (5 минут)
- **`DEPLOY.md`** - подробная инструкция со всеми вариантами
- **`backend/.env.production.example`** - пример переменных для бэкенда
- **`frontend/.env.production.example`** - пример переменных для фронтенда

---

## 🆘 Проблемы?

1. **CORS ошибки** → Проверьте `CORS_ORIGINS` в переменных бэкенда
2. **API не отвечает** → Проверьте логи Railway/Render
3. **Frontend не загружается** → Проверьте `REACT_APP_API_URL` в Vercel

---

## 🎉 После деплоя

Ваш сайт будет доступен на:
- 🌐 **Frontend:** https://corexdigital.de
- 🔌 **Backend API:** https://api.corexdigital.de/api/
- ✅ **Health Check:** https://api.corexdigital.de/api/status

---

**Удачи с деплоем! 🚀**
