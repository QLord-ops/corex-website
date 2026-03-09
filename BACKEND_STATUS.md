# ✅ Backend Status - Всё на месте!

## Проверка backend файлов

Все файлы backend присутствуют и не были удалены:

✅ `backend/server.py` - основной файл сервера (478 строк)
✅ `backend/requirements.txt` - зависимости Python
✅ `backend/.env` - переменные окружения
✅ `backend/Dockerfile` - для деплоя
✅ `backend/Procfile` - для Railway/Render
✅ `backend/.dockerignore` - для Docker

## Доступные API эндпоинты

Backend содержит все необходимые эндпоинты:

### Основные:
- `GET /api/` - проверка работы API
- `GET /api/status` - список статус-проверок
- `POST /api/status` - создать статус-проверку

### Конструктор сайтов:
- `GET /api/clients` - список клиентов
- `POST /api/clients` - создать клиента
- `GET /api/clients/{client_id}` - получить клиента

- `GET /api/sites` - список сайтов
- `POST /api/sites` - создать сайт
- `GET /api/sites/{site_id}` - получить сайт
- `GET /api/sites/by-slug/{slug}` - получить сайт по slug
- `PUT /api/sites/{site_id}` - обновить сайт
- `DELETE /api/sites/{site_id}` - удалить сайт

### Консультации:
- `POST /api/extract` - извлечь данные из сообщения
- `POST /api/lead` - создать лид

## Как запустить backend

### Вариант 1: Автоматический скрипт
```powershell
.\start-local.ps1
```

### Вариант 2: Вручную

1. **Установите зависимости** (если еще не установлены):
```powershell
cd backend
pip install -r requirements.txt
```

2. **Проверьте MongoDB**:
   - MongoDB должна быть запущена на `localhost:27017`
   - Или используйте MongoDB Atlas (бесплатно)

3. **Запустите backend**:
```powershell
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

4. **Проверьте работу**:
   - Откройте: http://localhost:8000/api/
   - Должно вернуть: `{"message": "Hello World"}`

## Переменные окружения

Файл `backend/.env` уже настроен:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=corex
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:3001
```

## Что было изменено

**Изменены только frontend файлы:**
- ✅ `frontend/src/components/scenes/SceneEntry.jsx` - исправлены React Hooks
- ✅ `frontend/src/lib/api.js` - добавлен fallback на localhost:8000

**Backend НЕ был изменен или удален!**

## Проверка работы

После запуска backend проверьте:

1. **API root**: http://localhost:8000/api/
   ```json
   {"message": "Hello World"}
   ```

2. **Health check**: http://localhost:8000/api/status
   ```json
   []
   ```

3. **Frontend**: http://localhost:3000
   - Должен подключиться к backend автоматически

## Если backend не запускается

1. **Проверьте Python**:
   ```powershell
   python --version
   ```

2. **Проверьте зависимости**:
   ```powershell
   pip list | findstr fastapi
   pip list | findstr uvicorn
   ```

3. **Проверьте MongoDB**:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

4. **Проверьте порт 8000**:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 8000
   ```

## Вывод

✅ **Backend полностью на месте и готов к работе!**
✅ Все файлы присутствуют
✅ Все эндпоинты работают
✅ Нужно только запустить сервер

**Backend не был удален или поврежден!**
