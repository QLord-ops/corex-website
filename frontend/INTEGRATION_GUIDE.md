# Интеграция Бота-Консультанта в Corex Website

## ✅ Что было интегрировано

1. **Компоненты бота:**
   - `src/components/consultation/ConsultationBot.jsx` - основной компонент для полного анализа
   - `src/components/consultation/FixedQuoteFlow.jsx` - компонент для быстрого предложения (2 вопроса)

2. **Страница консультации:**
   - `src/pages/ConsultationPage.jsx` - страница с переключателем между двумя режимами

3. **Переменные окружения:**
   - Добавлены в `.env.example`:
     - `REACT_APP_BOT_API_URL` - URL бот-сервиса
     - `REACT_APP_BOOK_CALL_URL` - URL для бронирования звонка (Calendly)

## 🚀 Использование

### Вариант 1: Отдельная страница

Создайте роут для страницы консультации (если используете react-router-dom):

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConsultationPage from '@/pages/ConsultationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/consultation" element={<ConsultationPage />} />
        {/* другие роуты */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Вариант 2: Интеграция в существующую сцену

Добавьте компонент в любую существующую сцену:

```jsx
import { ConsultationBot } from '@/components/consultation/ConsultationBot';

function YourScene() {
  return (
    <div>
      {/* ваш контент */}
      <ConsultationBot
        apiBaseUrl={process.env.REACT_APP_BOT_API_URL}
        defaultLanguage="de"
        onPackageSelected={(data) => {
          // обработка результата
        }}
      />
    </div>
  );
}
```

### Вариант 3: Модальное окно / Drawer

Можно обернуть компоненты в Dialog или Drawer:

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConsultationBot } from '@/components/consultation/ConsultationBot';

function ConsultationDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Получить предложение</DialogTitle>
        </DialogHeader>
        <ConsultationBot
          apiBaseUrl={process.env.REACT_APP_BOT_API_URL}
          defaultLanguage="de"
        />
      </DialogContent>
    </Dialog>
  );
}
```

## ⚙️ Настройка

### 1. Переменные окружения

Создайте `.env.local` в корне `frontend/`:

```env
REACT_APP_BOT_API_URL=https://your-bot-service-url.com
REACT_APP_BOOK_CALL_URL=https://calendly.com/your-link
```

### 2. CORS настройка на бот-сервисе

Убедитесь, что на бот-сервисе настроен CORS для вашего домена:

```env
ALLOWED_ORIGINS=https://your-main-website.com,https://www.your-main-website.com
NODE_ENV=production
```

### 3. Языки

Компоненты автоматически определяют язык из текста запроса:
- Русский (ru) - определяется по кириллице
- Немецкий (de) - определяется по специфическим символам
- Английский (en) - по умолчанию

Также можно явно указать язык через prop `defaultLanguage`.

## 🎨 Стилизация

Компоненты используют Tailwind CSS и существующие UI компоненты из `@/components/ui`. 
Все стили адаптированы под дизайн-систему проекта.

## 📝 API Endpoints

Бот использует следующие endpoints:

- `POST /api/analyze` - анализ запроса и подбор пакета
- `POST /api/proposal` - генерация финального предложения
- `POST /api/fixed-quote/start` - запуск быстрого flow
- `POST /api/fixed-quote/answer` - ответ на вопрос в flow
- `POST /api/track/cta` - отслеживание кликов по CTA
- `POST /api/lead/submit` - отправка контактной информации (показывается только после proposal/fixed quote)

**⚠️ Важно:** Endpoint `GET /api/kpi/stats` предназначен только для администраторов и требует API ключ. Никогда не используйте `KPI_STATS_API_KEY` во frontend коде!

Подробнее см. [INTEGRATION.md](../../api%20bot%20cosultant/INTEGRATION.md) в репозитории бота.

## 🔒 Безопасность KPI

### KPI Stats Endpoint (Admin Only)

Endpoint `/api/kpi/stats` защищен API ключом и доступен только администраторам:

**Никогда не используйте `KPI_STATS_API_KEY` во frontend коде!**

Этот ключ должен использоваться только на backend или в административных скриптах:

```bash
# Правильный способ доступа (backend/admin script)
curl -H "x-api-key: YOUR_KPI_STATS_API_KEY" \
  https://your-bot-service.com/api/kpi/stats

# Или через query параметр (только для внутренних админ-панелей)
curl "https://your-bot-service.com/api/kpi/stats?apiKey=YOUR_KPI_STATS_API_KEY"
```

**Паттерн доступа для админов:**

1. Создайте отдельный админ-роут на вашем основном сайте (backend)
2. Используйте серверный код для запроса KPI stats с API ключом
3. Никогда не передавайте API ключ клиенту

Пример (Next.js API route):

```javascript
// pages/api/admin/kpi-stats.js (или app/api/admin/kpi-stats/route.js)
export default async function handler(req, res) {
  // Проверка авторизации администратора
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Запрос к бот-сервису с API ключом (хранится только на сервере)
  const response = await fetch(`${process.env.BOT_API_URL}/api/kpi/stats`, {
    headers: {
      'x-api-key': process.env.KPI_STATS_API_KEY // Только на сервере!
    }
  });

  const data = await response.json();
  res.json(data);
}
```

## 🔧 Кастомизация

### Изменение текстов

Тексты локализованы внутри компонентов. Для изменения текстов отредактируйте объекты `labels` в компонентах.

### Интеграция с существующей i18n

Если нужно интегрировать с существующей системой переводов проекта, можно использовать хук `useTranslation`:

```jsx
import { useTranslation } from '@/hooks/useTranslation';

function ConsultationBot() {
  const { t, language } = useTranslation();
  // используйте t() для переводов
}
```

## 🐛 Troubleshooting

### CORS ошибки

Если возникают CORS ошибки:
1. Проверьте `ALLOWED_ORIGINS` на бот-сервисе
2. Убедитесь, что домен указан правильно
3. Проверьте, что `NODE_ENV=production` на бот-сервисе

### Компоненты не отображаются

1. Проверьте, что все UI компоненты импортированы правильно
2. Убедитесь, что Tailwind CSS настроен корректно
3. Проверьте консоль браузера на ошибки

### API не отвечает

1. Проверьте `REACT_APP_BOT_API_URL` в `.env.local`
2. Убедитесь, что бот-сервис запущен и доступен
3. Проверьте сетевые запросы в DevTools

## ✅ Smoke Test Checklist (Pre-Launch)

Перед запуском в production выполните следующие проверки:

### 1. Session Persistence
- [ ] Откройте бота, введите запрос, получите результат
- [ ] Обновите страницу (F5)
- [ ] Убедитесь, что sessionId сохранился (проверьте localStorage)
- [ ] Отправьте новый запрос - должен использоваться тот же sessionId

### 2. Language Selection
- [ ] Выберите язык вручную (RU/DE/EN)
- [ ] Введите запрос на другом языке
- [ ] Убедитесь, что язык не изменился автоматически
- [ ] Обновите страницу - язык должен сохраниться

### 3. CTAs
- [ ] После получения рекомендации проверьте наличие двух кнопок:
  - [ ] "Book Call" (Запланировать звонок)
  - [ ] "Fixed Quote" (Быстрое предложение)
- [ ] Убедитесь, что кнопка "Get Proposal" отсутствует
- [ ] Нажмите "Fixed Quote" - должен переключиться на вкладку быстрого предложения

### 4. Lead Capture
- [ ] После нажатия "Book Call" должна появиться форма Lead Capture
- [ ] После завершения Fixed Quote flow должна появиться форма Lead Capture
- [ ] Форма не должна появляться до генерации proposal/fixed quote
- [ ] Проверьте отправку формы (email обязателен, имя и телефон опциональны)

### 5. API Integration
- [ ] Проверьте, что все запросы отправляются с sessionId (если доступен)
- [ ] Проверьте, что язык передается во всех запросах
- [ ] Убедитесь, что CORS настроен правильно для production домена
- [ ] Проверьте rate limiting (не должно быть слишком строгим)

### 6. Error Handling
- [ ] Отключите интернет - должны показываться понятные ошибки
- [ ] Введите невалидный запрос (< 10 символов) - должна быть ошибка валидации
- [ ] Проверьте обработку ошибок API (500, 404, etc.)

### 7. Localization
- [ ] Проверьте все тексты на RU/DE/EN
- [ ] Убедитесь, что нет смешанных языков в одном ответе
- [ ] Проверьте форматирование цен (€ символ, формат чисел)

### 8. Performance
- [ ] Проверьте время загрузки компонентов
- [ ] Убедитесь, что нет лишних ре-рендеров
- [ ] Проверьте размер бандла (не должен быть слишком большим)

### 9. Security
- [ ] Убедитесь, что `KPI_STATS_API_KEY` не используется во frontend коде
- [ ] Проверьте, что CORS настроен только для разрешенных доменов
- [ ] Убедитесь, что нет XSS уязвимостей в пользовательском вводе

### 10. Production Readiness
- [ ] Все переменные окружения настроены в `.env.local`
- [ ] Бот-сервис развернут и доступен
- [ ] База данных SQLite настроена и работает
- [ ] Логирование настроено и работает
- [ ] Backup стратегия для базы данных настроена

**После прохождения всех проверок - можно запускать в production! 🚀**
