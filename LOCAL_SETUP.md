# 🖥️ Локальный запуск corex-website

## Быстрый старт

### Вариант 1: Автоматический запуск (PowerShell)

```powershell
.\start-local.ps1
```

### Вариант 2: Ручной запуск

#### 1. Настройка MongoDB

**Вариант A: MongoDB Atlas (рекомендуется, бесплатно)**

1. Зайдите на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте бесплатный аккаунт
3. Создайте кластер (бесплатный M0)
4. Database Access → Create Database User
5. Network Access → Add IP Address (0.0.0.0/0 для разработки)
6. Clusters → Connect → Connect your application
7. Скопируйте connection string

Обновите `backend\.env`:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=corex
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Вариант B: Локальная установка MongoDB**

1. Скачайте MongoDB Community: https://www.mongodb.com/try/download/community
2. Установите с настройками по умолчанию
3. MongoDB запустится автоматически как служба Windows

#### 2. Запуск бэкенда

```powershell
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Бэкенд будет доступен на: http://localhost:8000

#### 3. Запуск фронтенда

В новом терминале:

```powershell
cd frontend
npm install  # если еще не установлено
npm start
```

Или если используете yarn:
```powershell
yarn install
yarn start
```

Фронтенд будет доступен на: http://localhost:3000

---

## Проверка работы

1. **Backend API:** http://localhost:8000/api/
   - Должен вернуть: `{"message": "Hello World"}`

2. **Frontend:** http://localhost:3000
   - Должен открыться главная страница

3. **Health Check:** http://localhost:8000/api/status
   - Проверка работы API

---

## Переменные окружения

### Backend (`backend\.env`):
```
MONGO_URL=mongodb://localhost:27017
# или для Atlas:
# MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/

DB_NAME=corex
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (опционально, `frontend\.env.local`):
```
REACT_APP_API_URL=http://localhost:8000
```

---

## Troubleshooting

### MongoDB не запускается
- Проверьте, что MongoDB установлена: `Get-Service -Name "*mongo*"`
- Или используйте MongoDB Atlas (бесплатно)

### Порт 8000 занят
- Измените порт в команде запуска: `--port 8001`
- Обновите `CORS_ORIGINS` в `.env`

### Порт 3000 занят
- React автоматически предложит другой порт (3001, 3002...)

### CORS ошибки
- Убедитесь, что `CORS_ORIGINS` в `backend\.env` содержит ваш фронтенд URL

---

## Остановка серверов

- **Backend:** `Ctrl+C` в терминале бэкенда
- **Frontend:** `Ctrl+C` в терминале фронтенда
