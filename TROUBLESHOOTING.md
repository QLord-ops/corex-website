# Диагностика проблем

## Если сайт не работает после оптимизации

### 1. Проверьте консоль браузера
Откройте DevTools (F12) → Console и посмотрите на ошибки.

### 2. Возможные проблемы и решения

#### Проблема: "Cannot find module '@/utils/device'"
**Решение:** Убедитесь, что файл `frontend/src/utils/device.js` существует.

#### Проблема: "Cannot read property 'get' of undefined"
**Решение:** Это может быть проблема с lazy loading. Проверьте, что все компоненты экспортируются правильно.

#### Проблема: Белый экран
**Решение:** 
1. Проверьте консоль браузера на ошибки
2. Проверьте Network tab - все ли файлы загружаются
3. Попробуйте очистить кеш браузера (Ctrl+Shift+R)

### 3. Быстрое исправление

Если ничего не помогает, можно временно отключить lazy loading:

В `frontend/src/components/ScrollExperience.jsx` замените:

```javascript
// Вместо lazy loading используйте прямые импорты:
import { LivingSystemBackground } from './effects/LivingSystemBackground';
import { LivingSystemBackgroundMobile } from './effects/LivingSystemBackgroundMobile';
import { ScenePain } from './scenes/ScenePain';
// ... и т.д.
```

И уберите `<Suspense>` обертки.

### 4. Проверка сборки

```bash
cd frontend
npm run build
```

Если сборка проходит успешно, проблема может быть в runtime.

### 5. Проверка dev server

```bash
cd frontend
npm start
```

Откройте http://localhost:3000 и проверьте консоль.
