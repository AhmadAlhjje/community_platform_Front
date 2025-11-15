# حل المشاكل الشائعة

## ✅ التعديلات التي تمت

### 1. إصلاح Zustand Stores
تم إصلاح جميع الـ stores لتجنب أخطاء SSR:
- `lib/store/theme-store.ts` ✅
- `lib/store/language-store.ts` ✅
- `lib/store/auth-store.ts` ✅

### 2. إضافة ESLint Config
تم إنشاء `.eslintrc.json` ✅

---

## 🔧 مشاكل محتملة وحلولها

### المشكلة 1: Hydration Error
**الخطأ:** `Text content does not match server-rendered HTML`

**الحل:**
تأكد من استخدام `'use client'` في جميع المكونات التي تستخدم:
- Zustand stores
- useEffect
- useState
- أي Browser APIs

**مثال:**
```tsx
'use client'

import { useThemeStore } from '@/lib/store/theme-store'
```

---

### المشكلة 2: localStorage is not defined
**الخطأ:** `ReferenceError: localStorage is not defined`

**الحل:**
تم حله في ملفات الـ stores. إذا ظهرت المشكلة في مكان آخر:

```typescript
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value')
}
```

---

### المشكلة 3: Module not found
**الخطأ:** `Module not found: Can't resolve '@/...'`

**الحل:**
```bash
npm install
```

إذا استمرت المشكلة:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### المشكلة 4: Port already in use
**الخطأ:** `Port 3000 is already in use`

**الحل:**
السيرفر سيختار port تلقائياً (3001, 3002, إلخ)

أو حدد port يدوياً:
```bash
PORT=3005 npm run dev
```

---

### المشكلة 5: CORS Error
**الخطأ:** `Access to fetch has been blocked by CORS policy`

**الحل:**
تأكد من Backend:
```javascript
// في Backend (Express مثلاً)
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:3000', // أو port الذي تستخدمه
  credentials: true
}))
```

---

### المشكلة 6: API Connection Failed
**الخطأ:** `Failed to fetch` أو `Network Error`

**الحل:**
1. تأكد من أن Backend يعمل على `http://localhost:5000`
2. تحقق من ملف `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
3. أعد تشغيل Frontend:
```bash
npm run dev
```

---

### المشكلة 7: TypeScript Errors
**الخطأ:** `Type 'X' is not assignable to type 'Y'`

**الحل:**
تحقق من `types/api.ts` وتأكد من تطابق Types مع Backend

---

### المشكلة 8: Image Optimization Error
**الخطأ:** `Invalid src prop` في Next Image

**الحل:**
تأكد من أن `next.config.mjs` يحتوي على:
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

### المشكلة 9: Zustand Persist Hydration
**الخطأ:** قيم مختلفة بين Server و Client

**الحل:**
تم حله بإضافة `createJSONStorage` مع fallback

إذا استمرت المشكلة، استخدم:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/lib/store/theme-store'

export function MyComponent() {
  const [mounted, setMounted] = useState(false)
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // أو skeleton

  return <div>{theme}</div>
}
```

---

### المشكلة 10: Framer Motion Layout Shift
**الخطأ:** animation يسبب layout shift

**الحل:**
أضف `layout` prop:
```tsx
<motion.div
  layout
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  ...
</motion.div>
```

---

## 🚀 خطوات التشغيل الصحيحة

```bash
# 1. تأكد من تثبيت المكتبات
npm install

# 2. تأكد من وجود ملف البيئة
cat .env.local

# 3. تأكد من Backend
# Backend يجب أن يعمل على http://localhost:5000

# 4. شغل Frontend
npm run dev

# 5. افتح المتصفح
# http://localhost:3000 (أو Port آخر إذا ظهر)
```

---

## 🔍 التحقق من الأخطاء

### في الترمينال:
```bash
npm run dev
```
شاهد الأخطاء في Terminal

### في المتصفح:
- افتح Developer Tools (F12)
- اذهب إلى Console
- اذهب إلى Network tab

---

## 📝 أخطاء شائعة في الكود

### ❌ خطأ:
```tsx
const { user } = useAuthStore()
```

### ✅ صحيح:
```tsx
const user = useAuthStore((state) => state.user)
```

---

### ❌ خطأ:
```tsx
export default function Page() {
  const theme = useThemeStore((state) => state.theme)
  // ...
}
```

### ✅ صحيح:
```tsx
'use client'

export default function Page() {
  const theme = useThemeStore((state) => state.theme)
  // ...
}
```

---

### ❌ خطأ:
```tsx
<Image src={imageUrl} />
```

### ✅ صحيح:
```tsx
<Image
  src={imageUrl}
  alt="description"
  width={500}
  height={300}
/>
```

---

## 🛠️ أدوات مساعدة

### إعادة build كاملة:
```bash
rm -rf .next
npm run build
```

### مسح cache:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### تشغيل production محلياً:
```bash
npm run build
npm start
```

---

## 📞 إذا استمرت المشاكل

1. تحقق من Console في المتصفح (F12)
2. تحقق من Terminal حيث يعمل `npm run dev`
3. تحقق من Network tab في DevTools
4. تأكد من Backend API يعمل
5. راجع [BACKEND_NOTES.md](./BACKEND_NOTES.md)

---

**ملاحظة:** جميع المشاكل المذكورة أعلاه تم حلها في الكود الحالي ✅
