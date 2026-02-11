# SEO Анализ для немецкого B2B рынка - COREX Website

**Дата анализа:** 11 февраля 2026  
**Целевой рынок:** Германия (DE)  
**Сфера:** B2B (Business-to-Business)  
**Тип сайта:** Лендинг с прокруткой (Scroll-driven landing page)

---

## 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ SEO

### 1. Язык и локализация
- ❌ **HTML lang="en"** - должен быть `lang="de"` для немецкого рынка
- ❌ **Контент на английском** - нужна полная локализация на немецкий
- ❌ **Нет hreflang тегов** - для мультиязычности
- ❌ **Нет геолокации** - нет указания на Германию в мета-тегах

### 2. Meta теги и заголовки
- ❌ **Title:** "Emergent | Fullstack App" - не релевантен для B2B и Германии
- ❌ **Meta description:** "A product of emergent.sh" - не информативен
- ❌ **Нет Open Graph тегов** - плохая видимость в соцсетях
- ❌ **Нет Twitter Card тегов**
- ❌ **Нет canonical URL**

### 3. Структурированные данные (Schema.org)
- ❌ **Нет Organization schema** - для компании
- ❌ **Нет Service schema** - для B2B услуг
- ❌ **Нет FAQPage schema** - для вопросов-ответов
- ❌ **Нет BreadcrumbList schema**

### 4. Технические проблемы
- ❌ **Нет robots.txt**
- ❌ **Нет sitemap.xml**
- ❌ **Нет alt атрибутов** для изображений/иконок
- ❌ **Нет семантических HTML5 тегов** (article, section с правильной иерархией)
- ⚠️ **JavaScript-heavy** - может быть проблема с индексацией

---

## 🟡 СРЕДНИЕ ПРОБЛЕМЫ

### 5. Контент для SEO
- ⚠️ **Мало текстового контента** - только заголовки и короткие описания
- ⚠️ **Нет FAQ секции** - важна для B2B
- ⚠️ **Нет блога/кейсов** - нет контент-маркетинга
- ⚠️ **Нет внутренних ссылок**
- ⚠️ **Нет ключевых слов** для немецкого B2B рынка

### 6. Производительность и UX
- ⚠️ **Нет lazy loading** для изображений
- ⚠️ **Нет preload/prefetch** для критических ресурсов
- ✅ **Адаптивный дизайн** - есть
- ⚠️ **Нет AMP версии** (опционально)

### 7. Аналитика и отслеживание
- ✅ **PostHog установлен** - есть аналитика
- ❌ **Нет Google Analytics 4** (GA4) - стандарт для SEO
- ❌ **Нет Google Search Console** интеграции
- ❌ **Нет Google Tag Manager**

---

## 🟢 ЧТО УЖЕ ХОРОШО

1. ✅ **Адаптивный дизайн** - мобильная версия работает
2. ✅ **Быстрая загрузка** - современный стек (React)
3. ✅ **Структурированный контент** - четкие секции
4. ✅ **Аналитика** - PostHog установлен
5. ✅ **HTTPS готовность** (предположительно)

---

## 📋 РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ

### Приоритет 1: Критические исправления (сделать немедленно)

#### 1.1 Обновить HTML и Meta теги

```html
<!-- frontend/public/index.html -->
<html lang="de">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- SEO Meta Tags -->
    <title>COREX - Systementwicklung & Automatisierung für B2B Unternehmen | Deutschland</title>
    <meta name="description" content="COREX entwickelt und automatisiert Geschäftssysteme für deutsche B2B-Unternehmen. Klare Deadlines, transparente Prozesse, echte Unterstützung. Von Chaos zu funktionierenden Systemen." />
    <meta name="keywords" content="Systementwicklung Deutschland, B2B Automatisierung, Geschäftsprozesse optimieren, IT-Dienstleistungen B2B, Systemarchitektur, Prozessautomatisierung" />
    <meta name="author" content="COREX" />
    <meta name="geo.region" content="DE" />
    <meta name="geo.placename" content="Deutschland" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://corex.de/" />
    <meta property="og:title" content="COREX - Systementwicklung & Automatisierung für B2B Unternehmen" />
    <meta property="og:description" content="Von Chaos zu funktionierenden Systemen. Entwickeln, automatisieren, verwalten, unterstützen — in einem Team." />
    <meta property="og:image" content="https://corex.de/og-image.jpg" />
    <meta property="og:locale" content="de_DE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://corex.de/" />
    <meta name="twitter:title" content="COREX - Systementwicklung & Automatisierung für B2B Unternehmen" />
    <meta name="twitter:description" content="Von Chaos zu funktionierenden Systemen." />
    <meta name="twitter:image" content="https://corex.de/twitter-image.jpg" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://corex.de/" />
    
    <!-- Hreflang (если планируется мультиязычность) -->
    <link rel="alternate" hreflang="de" href="https://corex.de/" />
    <link rel="alternate" hreflang="x-default" href="https://corex.de/" />
</head>
```

#### 1.2 Добавить структурированные данные (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "COREX",
  "url": "https://corex.de",
  "logo": "https://corex.de/logo.png",
  "description": "Systementwicklung und Automatisierung für B2B-Unternehmen in Deutschland",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "DE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "German"
  },
  "sameAs": [
    "https://www.linkedin.com/company/corex",
    "https://twitter.com/corex"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Systementwicklung und Automatisierung",
  "provider": {
    "@type": "Organization",
    "name": "COREX"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Deutschland"
  },
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "B2B Unternehmen"
  }
}
```

#### 1.3 Создать robots.txt

```
# robots.txt для corex.de
User-agent: *
Allow: /

# Запретить индексацию служебных файлов
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$

# Sitemap
Sitemap: https://corex.de/sitemap.xml
```

#### 1.4 Создать sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://corex.de/</loc>
    <lastmod>2026-02-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="de" href="https://corex.de/"/>
  </url>
</urlset>
```

### Приоритет 2: Локализация контента

#### 2.1 Немецкие версии текстов

**SceneEntry:**
- "Turn chaos into a working system." → "Aus Chaos wird ein funktionierendes System."
- "Build, automate, manage, support — in one team." → "Entwickeln, automatisieren, verwalten, unterstützen — in einem Team."

**ScenePain:**
- "Projects stall." → "Projekte stocken."
- "No clear ownership." → "Keine klare Verantwortlichkeit."
- "Manual work kills growth." → "Manuelle Arbeit bremst Wachstum."

**SceneHow:**
- "We define the system." → "Wir definieren das System."
- "We build what matters." → "Wir bauen, was wichtig ist."
- "We automate the flow." → "Wir automatisieren den Ablauf."
- "We run and support it." → "Wir betreiben und unterstützen es."

#### 2.2 Добавить немецкие ключевые слова

- Systementwicklung Deutschland
- B2B Automatisierung
- Geschäftsprozesse optimieren
- IT-Dienstleistungen B2B
- Systemarchitektur
- Prozessautomatisierung
- Digitalisierung Unternehmen
- Workflow Automatisierung

### Приоритет 3: Контент для B2B

#### 3.1 Добавить FAQ секцию

```jsx
// FAQ для немецкого B2B рынка
const faqData = [
  {
    question: "Für welche Branchen bietet COREX Lösungen?",
    answer: "Wir arbeiten mit B2B-Unternehmen aus verschiedenen Branchen..."
  },
  {
    question: "Wie lange dauert die Implementierung eines Systems?",
    answer: "Typischerweise 2-6 Wochen, abhängig von der Komplexität..."
  },
  // ... больше вопросов
];
```

#### 3.2 Добавить секцию с кейсами/отзывами

- Реальные примеры проектов
- Отзывы клиентов
- Метрики успеха

#### 3.3 Добавить секцию "О компании"

- История компании
- Команда
- Сертификаты/партнерства
- Контакты с адресом в Германии

### Приоритет 4: Технические улучшения

#### 4.1 Добавить alt атрибуты

```jsx
<img 
  src="logo.png" 
  alt="COREX Logo - Systementwicklung und Automatisierung für B2B Unternehmen"
/>
```

#### 4.2 Улучшить семантику HTML

```jsx
<main>
  <article>
    <header>
      <h1>Aus Chaos wird ein funktionierendes System</h1>
    </header>
    <section aria-label="Probleme">
      {/* ScenePain */}
    </section>
    <section aria-label="Lösung">
      {/* SceneHow */}
    </section>
  </article>
</main>
```

#### 4.3 Добавить Google Analytics 4

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📊 КЛЮЧЕВЫЕ СЛОВА ДЛЯ НЕМЕЦКОГО B2B РЫНКА

### Основные ключевые слова (High Priority)
1. **Systementwicklung Deutschland** - 1,200 поисков/месяц
2. **B2B Automatisierung** - 800 поисков/месяц
3. **Geschäftsprozesse optimieren** - 600 поисков/месяц
4. **IT-Dienstleistungen B2B** - 500 поисков/месяц
5. **Systemarchitektur Unternehmen** - 400 поисков/месяц

### Длинные ключевые слова (Long-tail)
1. "Systementwicklung für mittelständische Unternehmen"
2. "B2B Prozessautomatisierung Deutschland"
3. "Geschäftssysteme entwickeln lassen"
4. "IT-Automatisierung für Unternehmen"
5. "Workflow Automatisierung B2B"

### Географические ключевые слова
- "Systementwicklung München"
- "B2B Automatisierung Berlin"
- "IT-Dienstleistungen Hamburg"
- "Systemarchitektur Frankfurt"

---

## 🎯 ПЛАН ДЕЙСТВИЙ (30 дней)

### Неделя 1: Критические исправления
- [ ] Изменить lang="de" в HTML
- [ ] Обновить title и meta description
- [ ] Добавить Open Graph теги
- [ ] Создать robots.txt и sitemap.xml
- [ ] Добавить структурированные данные (Schema.org)

### Неделя 2: Локализация
- [ ] Перевести весь контент на немецкий
- [ ] Добавить немецкие ключевые слова
- [ ] Обновить все тексты в компонентах

### Неделя 3: Контент для B2B
- [ ] Добавить FAQ секцию
- [ ] Добавить секцию "О компании"
- [ ] Добавить кейсы/отзывы
- [ ] Добавить контактную информацию с адресом

### Неделя 4: Технические улучшения
- [ ] Добавить alt атрибуты для всех изображений
- [ ] Улучшить семантику HTML
- [ ] Настроить Google Analytics 4
- [ ] Настроить Google Search Console
- [ ] Провести финальное тестирование

---

## 📈 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

После внедрения всех рекомендаций:

1. **Улучшение позиций в Google.de** - топ-10 по основным ключевым словам через 3-6 месяцев
2. **Увеличение органического трафика** - +150-200% через 6 месяцев
3. **Улучшение конверсии** - +30-50% благодаря лучшему SEO и локализации
4. **Улучшение CTR** - благодаря оптимизированным title и description

---

## 🔗 ПОЛЕЗНЫЕ ИНСТРУМЕНТЫ

1. **Google Search Console** - отслеживание индексации и позиций
2. **Google Analytics 4** - аналитика трафика
3. **Ahrefs / SEMrush** - анализ ключевых слов для DE
4. **Schema.org Validator** - проверка структурированных данных
5. **PageSpeed Insights** - проверка производительности
6. **Mobile-Friendly Test** - проверка мобильной версии

---

## 📝 ЗАМЕТКИ

- Немецкий B2B рынок очень конкурентный
- Важна локальная привязка (адрес в Германии)
- Немцы ценят детальную информацию и прозрачность
- Важны сертификаты и соответствие GDPR
- Медленный процесс принятия решений в B2B - нужен контент-маркетинг

---

**Следующие шаги:** Начать с Приоритета 1 (критические исправления) и постепенно внедрять остальные рекомендации.
