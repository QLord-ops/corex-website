# 🗄️ Настройка MongoDB для локального запуска

## ⚠️ Текущая ситуация

Бэкенд запущен, но требует MongoDB для работы. MongoDB не установлена локально.

---

## 🚀 Вариант 1: MongoDB Atlas (рекомендуется, 2 минуты)

**Бесплатно, без установки, работает сразу**

### Шаги:

1. **Создайте аккаунт:**
   - Зайдите на https://www.mongodb.com/cloud/atlas/register
   - Зарегистрируйтесь (бесплатно)

2. **Создайте кластер:**
   - Нажмите "Build a Database"
   - Выберите **FREE** (M0) кластер
   - Выберите регион (ближайший к вам)
   - Нажмите "Create"

3. **Создайте пользователя базы данных:**
   - Database Access → Add New Database User
   - Username: `corexuser` (или любое)
   - Password: создайте надежный пароль (сохраните его!)
   - Database User Privileges: "Read and write to any database"
   - Add User

4. **Настройте сетевой доступ:**
   - Network Access → Add IP Address
   - Add Current IP Address (или 0.0.0.0/0 для разработки)
   - Confirm

5. **Получите connection string:**
   - Clusters → Connect → Connect your application
   - Выберите "Python" и версию "3.6 or later"
   - Скопируйте строку подключения
   - Пример: `mongodb+srv://corexuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Обновите `backend\.env`:**
   ```
   MONGO_URL=mongodb+srv://corexuser:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=corex
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```
   ⚠️ **Важно:** Замените `<password>` на ваш реальный пароль!

7. **Перезапустите бэкенд:**
   - Остановите текущий процесс (Ctrl+C)
   - Запустите снова: `python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000`

---

## 💻 Вариант 2: Локальная установка MongoDB

### Windows:

1. **Скачайте MongoDB Community Server:**
   - https://www.mongodb.com/try/download/community
   - Выберите: Windows, MSI, x64
   - Скачайте и запустите установщик

2. **Установка:**
   - Выберите "Complete" установку
   - ✅ Install MongoDB as a Service
   - ✅ Install MongoDB Compass (GUI)
   - Install

3. **Проверка:**
   ```powershell
   Get-Service -Name "*mongo*"
   ```
   Должен показать службу "MongoDB" со статусом "Running"

4. **Готово!** MongoDB уже работает на `mongodb://localhost:27017`

5. **Обновите `backend\.env` (если нужно):**
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=corex
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

---

## ✅ Проверка подключения

После настройки MongoDB проверьте:

1. **Backend API:** http://localhost:8000/api/
   - Должен вернуть: `{"message": "Hello World"}`

2. **Health Check:** http://localhost:8000/api/status
   - Можете отправить POST запрос для проверки

3. **Frontend:** http://localhost:3000
   - Должен работать без ошибок в консоли

---

## 🔧 Troubleshooting

### Ошибка подключения к MongoDB Atlas
- Проверьте пароль в connection string
- Убедитесь, что IP адрес добавлен в Network Access
- Проверьте, что кластер запущен (может быть приостановлен)

### MongoDB локально не запускается
- Проверьте службу: `Get-Service -Name "*mongo*"`
- Запустите вручную: `net start MongoDB`
- Или используйте MongoDB Atlas

### CORS ошибки
- Убедитесь, что `CORS_ORIGINS` содержит правильный URL фронтенда
- Проверьте, что фронтенд запущен на порту из `CORS_ORIGINS`

---

## 📝 После настройки MongoDB

Ваш сайт будет полностью работать:
- ✅ Backend: http://localhost:8000/api/
- ✅ Frontend: http://localhost:3000
- ✅ Конструктор сайтов: http://localhost:3000/builder
- ✅ Консультация: http://localhost:3000/consultation
