# Скрипт запуска локального сервера для corex-website

Write-Host "🚀 Запуск локального сервера..." -ForegroundColor Green

# Проверка MongoDB
Write-Host "`n📦 Проверка MongoDB..." -ForegroundColor Yellow
$mongoRunning = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $mongoRunning) {
    Write-Host "⚠️  MongoDB не запущена!" -ForegroundColor Red
    Write-Host "`nВарианты:" -ForegroundColor Yellow
    Write-Host "1. Установите MongoDB: https://www.mongodb.com/try/download/community"
    Write-Host "2. Или используйте MongoDB Atlas (бесплатно): https://www.mongodb.com/cloud/atlas"
    Write-Host "`nДля MongoDB Atlas:" -ForegroundColor Cyan
    Write-Host "   - Создайте бесплатный кластер"
    Write-Host "   - Получите connection string"
    Write-Host "   - Обновите backend\.env: MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/"
    Write-Host ""
    $continue = Read-Host "Продолжить без MongoDB? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Запуск бэкенда
Write-Host "`n🔧 Запуск бэкенда (FastAPI)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
}

Start-Sleep -Seconds 3

# Проверка бэкенда
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Бэкенд запущен: http://localhost:8000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Бэкенд запускается..." -ForegroundColor Yellow
}

# Запуск фронтенда
Write-Host "`n🎨 Запуск фронтенда (React)..." -ForegroundColor Yellow
Set-Location frontend

# Проверка зависимостей
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    npm install
}

# Запуск dev сервера
Write-Host "`n✨ Серверы запускаются!" -ForegroundColor Green
Write-Host "`n📍 Доступные адреса:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000/api/" -ForegroundColor White
Write-Host "`n💡 Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

npm start
