# 🔧 Инструкция по очистке и пересборке приложения

## ⚠️ ВАЖНО: Медиа-библиотека требует полной пересборки!

Ошибка AUDIO permission происходит из-за кэшированного конфига. Нужно **полностью очистить просмотренный проект**.

---

## **Шаг 1️⃣: Остановите приложение**

Если приложение запущено:
```bash
# В терминале нажмите: Ctrl + C
```

---

## **Шаг 2️⃣: Очистите весь кэш и артефакты**

```bash
cd D:\Projects\Home\Home\frontend

# Очистите Expo кэш
npx expo prebuild --clean

# Очистите npm кэш (опционально)
npm cache clean --force

# Удалите node_modules если нужно свежая установка
rm -r node_modules  # или: rmdir /s /q node_modules (Windows)
npm install
```

---

## **Шаг 3️⃣: Очистите Gradle кэш (для Android)**

```bash
cd D:\Projects\Home\Home\frontend/android

# Очистите Gradle
./gradlew clean  # или: gradlew.bat clean (Windows PowerShell)

# Если на Windows используйте так:
gradlew.bat clean
```

---

## **Шаг 4️⃣: Пересоберите приложение**

```bash
cd D:\Projects\Home\Home\frontend

# Полная пересборка с clean флагом
npx expo prebuild --clean

# ИЛИ с удалением всех артефактов
npx expo prebuild --clean --config-only

# Затем установите зависимости
npm install
```

---

## **Шаг 5️⃣: Запустите приложение**

### **Для Android эмулятора:**
```bash
npm start

# Нажмите 'a' в меню для Android эмулятора
```

### **Для iOS симулятора:**
```bash
npm start

# Нажмите 'i' в меню для iOS симулятора
```

### **Для физического устройства:**
```bash
npm start

# Отсканируйте QR код приложением Expo Go
# или запустите с флагом: --local
npm start -- --local
```

---

## **Шаг 6️⃣: Проверьте что исправилось**

### ✅ Когда приложение запущено:

1. **Откройте результат генерации**
   - Нажмите кнопку "Download" / "Save"

2. **Проверьте разрешения**
   - Должно запросить только **Storage** разрешение
   - **НЕ должна** запросить **Audio/Microphone** разрешение

3. **Изображение должно сохраниться**
   - ✅ Пойдет в Apps → Decora Album
   - ✅ Уведомление "Success - Image saved"
   - ❌ НЕ должно быть ошибки про AUDIO

---

## **🔍 Если ошибка все еще происходит:**

### Проверка 1: Убедитесь что app.json обновлен

```bash
# Откройте файл и проверьте
cat app.json | grep -A 10 "expo-media-library"

# Должно быть так (БЕЗ isAccessMediaLocationEnabled и microphonePermission):
# [
#   "expo-media-library",
#   {
#     "photosPermission": "...",
#     "savePhotosPermission": "..."
#   }
# ]
```

### Проверка 2: Очистите все кэши более агрессивно

```bash
# Удалите .next, .expo, build папки
rm -rf .next .expo build dist .gradle
npm cache clean --force
npx expo prebuild --clean
```

### Проверка 3: Убедитесь что version из app.json обновлена

```bash
# Измените версию в app.json
# "version": "1.0.0" → "1.0.1"

# Это заставит Expo пересобрать с нуля
npx expo prebuild --clean
```

### Проверка 4: Очистите Data на устройстве

**На Android (через adb):**
```bash
adb shell pm clear com.aiinterior.app
```

**Или через Settings:**
- Settings → Apps → AI Interior Designer → 
- Storage → Clear Cache
- Storage → Clear Data

**На iOS:**
- Settings → General → iPhone Storage → AI Interior Designer → Delete App
- Переустановите приложение

---

## **📋 Полная последовательность (безопасная)**

Если ничто выше не сработало, выполните ВСЕ шаги по порядку:

```bash
# 1. Перейта в frontend директорию
cd D:\Projects\Home\Home\frontend

# 2. Остановите любые процессы
# Ctrl + C в каждом открытом терминале

# 3. Удалите все кэши и артефакты
rm -r node_modules .next .expo build dist .gradle .metro-cache

# 4. Очистите package-lock
rm package-lock.json

# 5. Переустановите зависимости
npm install

# 6. Очистите Expo
npx expo prebuild --clean

# 7. Очистите Gradle (если AndroidStudio установлен)
cd android
# На Windows: gradlew.bat clean
# На Mac/Linux: ./gradlew clean
cd ..

# 8. Запустите с флагом что-то свежее
npm start -- --clear
```

---

## **✅ Что было изменено в коде**

### 1. **app.json**
- ✅ Добавлен `READ_MEDIA_IMAGES` для Android 13+
- ✅ Удален `isAccessMediaLocationEnabled` (может вызывать лишние permissions)
- ✅ Убедитесь что нет `microphonePermission` в expo-media-library

### 2. **result.tsx (handleDownload)**
- ✅ Теперь вызывает `getPermissionsAsync()` ДО `requestPermissionsAsync()`
- ✅ Хороший logging для отладки
- ✅ Корректная обработка ошибок

### 3. **upload.tsx (handleSaveToGallery)**
- ✅ Та же логика проверки разрешений
- ✅ Лучший error handling
- ✅ Clean logging

---

## **🎯 Итоговый checklist**

- [ ] Остановлено приложение (Ctrl+C)
- [ ] Выполнена команда `npx expo prebuild --clean`
- [ ] Удалены node_modules и переустановлены
- [ ] Очищен Gradle кэш (Windows: gradlew.bat clean)
- [ ] Версия в app.json обновлена
- [ ] Приложение запущено заново (`npm start`)
- [ ] При сохранении просит ТОЛЬКО Storage разрешение
- [ ] Изображение успешно сохраняется
- [ ] Нет ошибки про AUDIO permission

---

## **💡 Советы**

### Если используете Android Studio эмулятор:
```bash
# Перезагрузите эмулятор полностью
adb emu kill
# Запустите заново из Android Studio
```

### Если используете Expo Go на телефоне:
```bash
# Полностью удалите и переустановите Expo Go
# Затем отсканируйте QR код заново
npm start -- --localhost
```

### Для быстрой разработки без пересборки:
```bash
# После первой успешной сборки можно использовать:
npm start -- --no-clear
# Это сохранит кэш между запусками
```

---

## **📞 Если проблемы продолжаются**

1. **Проверьте логи в консоли** при запуске `npm start`
2. **Откройте Device Logs** during app launch
3. **Посмотрите в Android Studio logcat** для ошибок
4. **Проверьте AndroidManifest.xml** что там правильные permissions

---

**⏱️ Общее время:** ~5-10 минут на полную очистку и пересборку

**✨ Результат:** Приложение будет запрашивать ТОЛЬКО Storage разрешение, без Audio!
