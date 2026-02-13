# ⚡ Быстрый запуск локально

## Шаг 1: Backend (уже должен быть запущен)

Если backend не запущен, откройте **новый терминал PowerShell** и выполните:

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

## Шаг 2: Frontend

Frontend уже запускается в фоне. Дождитесь сообщения:
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

Откройте браузер: **http://localhost:3000**

## Если видите ошибку "localhost sent an invalid response"

Это значит backend не запущен. Запустите его (см. Шаг 1 выше).

## Проверка что все работает

1. **Backend:** Откройте http://localhost:8000/api/status - должен вернуть JSON
2. **Frontend:** Откройте http://localhost:3000 - должна загрузиться страница
3. **Бот:** Прокрутите вниз до секции бота, введите тест - должен работать

## Остановка

- **Frontend:** `Ctrl+C` в терминале где запущен npm start
- **Backend:** `Ctrl+C` в терминале где запущен uvicorn
