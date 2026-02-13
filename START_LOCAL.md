# 🚀 Запуск локального сервера

## Быстрый старт

### 1. Запустить Backend (порт 8000)

Откройте **новый терминал** и выполните:

```bash
cd backend

# Создать виртуальное окружение (если еще не создано)
python -m venv venv

# Активировать виртуальное окружение
# Windows PowerShell:
venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Backend будет доступен на: `http://localhost:8000`

### 2. Запустить Frontend (порт 3000)

Откройте **другой терминал** и выполните:

```bash
cd frontend

# Установить зависимости (если еще не установлены)
npm install

# Запустить dev server
npm start
```

Frontend автоматически откроется в браузере на: `http://localhost:3000`

## Проверка что все работает

1. **Backend работает:**
   ```bash
   curl http://localhost:8000/api/status
   ```
   Должен вернуть JSON с статусом

2. **Frontend работает:**
   - Откройте `http://localhost:3000`
   - Должна загрузиться главная страница

3. **Бот работает:**
   - Прокрутите до секции бота
   - Введите тестовое сообщение
   - Нажмите "Kosten berechnen"
   - Должен прийти результат

## Если что-то не работает

### Ошибка "localhost sent an invalid response"
- Убедитесь что backend запущен на порту 8000
- Проверьте что порт 8000 не занят другим процессом
- Проверьте логи backend в терминале

### Бот показывает ошибку
- Убедитесь что backend запущен
- Проверьте консоль браузера (F12) на ошибки CORS
- Backend автоматически разрешает localhost в разработке

### Порт занят
```bash
# Windows - найти процесс на порту 3000
netstat -ano | findstr :3000

# Windows - найти процесс на порту 8000
netstat -ano | findstr :8000

# Убить процесс (замените PID на реальный)
taskkill /PID <PID> /F
```

## Остановка серверов

- **Frontend:** Нажмите `Ctrl+C` в терминале где запущен `npm start`
- **Backend:** Нажмите `Ctrl+C` в терминале где запущен `uvicorn`
