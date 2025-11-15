# دليل حل المشاكل السريع

## 🔍 كيف تعرف ما هي المشكلة؟

### 1. شاهد Terminal
عند تشغيل `npm run dev`، شاهد الأخطاء في Terminal

### 2. افتح Browser Console
- اضغط F12
- اذهب إلى Console tab
- شاهد الأخطاء باللون الأحمر

### 3. تحقق من Network
- في DevTools، اذهب إلى Network tab
- حاول تسجيل دخول
- شاهد طلبات API (تبدأ بـ `/api/`)
- إذا كانت حمراء (Failed)، هناك مشكلة في الاتصال

---

## 🚨 الأخطاء الشائعة وحلولها السريعة

### Error: "Hydration failed"
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**السبب:** استخدام Zustand stores أو browser APIs في server component

**الحل:**
أضف `'use client'` في أول السطر:
```tsx
'use client'

import { useAuthStore } from '@/lib/store/auth-store'
```

---

### Error: "localStorage is not defined"
```
ReferenceError: localStorage is not defined
```

**السبب:** محاولة الوصول لـ localStorage في server side

**الحل:** تم إصلاحه في الملفات، ولكن إذا ظهر:
```tsx
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value')
}
```

---

### Error: "Failed to fetch"
```
TypeError: Failed to fetch
```

**السبب:** Backend لا يعمل أو CORS

**الحل:**
1. تأكد أن Backend يعمل على `http://localhost:5000`
2. في Backend، أضف CORS:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

---

### Error: "Module not found"
```
Module not found: Can't resolve '@/components/...'
```

**الحل:**
```bash
npm install
```

---

### Error: Port in use
```
Error: Port 3000 is already in use
```

**الحل:**
Next.js سيختار port آخر تلقائياً (3001, 3002...)

أو:
```bash
PORT=3005 npm run dev
```

---

### Error: "Cannot read properties of null"
```
Cannot read properties of null (reading 'user')
```

**السبب:** user غير موجود في store

**الحل:**
```tsx
const user = useAuthStore((state) => state.user)

if (!user) return <div>Loading...</div>

return <div>{user.name}</div>
```

---

### Error: Invalid src prop (Next Image)
```
Invalid src prop (https://...) on `next/image`
```

**الحل:**
في `next.config.mjs`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

---

### Error: "Authentication failed"
```
401 Unauthorized
```

**السبب:** Token منتهي أو غير صحيح

**الحل:**
```javascript
// في Browser Console (F12)
localStorage.clear()
location.reload()
```

---

### Error: "Network request failed"
```
Network request failed
```

**الحل:**
1. تحقق من `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

2. تحقق من Backend يعمل:
```bash
# في terminal آخر
# شغل Backend على port 5000
```

3. أعد تشغيل Frontend:
```bash
npm run dev
```

---

## 🔧 حلول سريعة

### حل 90% من المشاكل:
```bash
# 1. امسح كل شيء
rm -rf .next node_modules

# 2. أعد التثبيت
npm install

# 3. شغل المشروع
npm run dev
```

### مشكلة في Build:
```bash
rm -rf .next
npm run build
```

### مشكلة في Cache:
```bash
# في Browser
# افتح DevTools (F12)
# اضغط بيمين على زر Reload
# اختر "Empty Cache and Hard Reload"
```

---

## 📋 Checklist قبل طلب المساعدة

قبل أن تطلب المساعدة، تحقق من:

- [ ] هل `npm install` نجح؟
- [ ] هل ملف `.env.local` موجود؟
- [ ] هل Backend يعمل على port 5000؟
- [ ] هل جربت `rm -rf .next && npm run dev`؟
- [ ] هل شاهدت Console في Browser (F12)؟
- [ ] هل شاهدت Network tab في DevTools؟
- [ ] هل جربت `localStorage.clear()`؟

---

## 🛠️ أدوات التشخيص

### اختبار Backend:
افتح في المتصفح:
```
http://localhost:5000/api/categories
```

إذا رجع JSON، Backend يعمل ✅

### اختبار CORS:
في Browser Console:
```javascript
fetch('http://localhost:5000/api/categories')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### اختبار Authentication:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: '123456'
  })
})
  .then(r => r.json())
  .then(console.log)
```

---

## 📞 أين تجد المساعدة؟

1. **[FIX_ERRORS.md](./FIX_ERRORS.md)** - حلول تفصيلية
2. **[README.md](./README.md)** - معلومات عامة
3. **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - دليل التثبيت
4. **[BACKEND_NOTES.md](./BACKEND_NOTES.md)** - مشاكل Backend

---

## 💡 نصائح مهمة

1. **اقرأ الخطأ كاملاً** - لا تتجاهل رسالة الخطأ
2. **Google هو صديقك** - ابحث عن الخطأ في Google
3. **DevTools مهم جداً** - F12 دائماً مفتوح
4. **Backend أولاً** - تأكد Backend يعمل قبل Frontend
5. **.env.local** - تحقق منه دائماً

---

**آخر تحديث:** نوفمبر 2025
