# Быстрое исправление проблем

## Если сайт не работает

### Шаг 1: Проверьте консоль браузера
1. Откройте сайт в браузере
2. Нажмите F12 (или правой кнопкой → Inspect)
3. Перейдите на вкладку **Console**
4. Посмотрите на ошибки (красным цветом)

### Шаг 2: Перезапустите dev server
```bash
cd frontend
npm start
```

### Шаг 3: Очистите кеш
- В браузере: Ctrl+Shift+R (Windows) или Cmd+Shift+R (Mac)
- Или откройте в режиме инкогнито

### Шаг 4: Проверьте ошибки сборки
```bash
cd frontend
npm run build
```

---

## Если ничего не помогает

### Временное отключение lazy loading

Откройте `frontend/src/components/ScrollExperience.jsx` и замените lazy loading на прямые импорты:

**Замените строки 8-19:**
```javascript
// Удалите эти строки:
const LivingSystemBackground = lazy(...);
const ScenePain = lazy(...);
// и т.д.

// Добавьте прямые импорты:
import { LivingSystemBackground } from './effects/LivingSystemBackground';
import { LivingSystemBackgroundMobile } from './effects/LivingSystemBackgroundMobile';
import { ScenePain } from './scenes/ScenePain';
import { SceneHow } from './scenes/SceneHow';
import { SceneProof } from './scenes/SceneProof';
import { SceneDecision } from './scenes/SceneDecision';
import { SceneFAQ } from './scenes/SceneFAQ';
import { SceneAbout } from './scenes/SceneAbout';
import { SceneTestimonials } from './scenes/SceneTestimonials';
import { SceneAction } from './scenes/SceneAction';
```

**И уберите `<Suspense>` обертки:**
```javascript
// Вместо:
<Suspense fallback={...}>
  <ScenePain />
</Suspense>

// Используйте:
<ScenePain />
```

---

## Частые ошибки

### "Cannot find module '@/utils/device'"
**Решение:** Убедитесь, что файл `frontend/src/utils/device.js` существует.

### "Cannot read property 'get' of undefined"
**Решение:** Это проблема с lazy loading. Используйте временное отключение (см. выше).

### Белый экран
**Решение:** 
1. Проверьте консоль браузера
2. Проверьте Network tab - все ли файлы загружаются
3. Попробуйте очистить кеш

---

## Проверка работоспособности

После исправлений проверьте:
- [ ] Сайт открывается
- [ ] Нет ошибок в консоли
- [ ] Все компоненты загружаются
- [ ] Анимации работают (или отключены на мобильных)
