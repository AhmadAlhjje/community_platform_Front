# دليل التثبيت والتشغيل - منصة تعزيز الوعي المجتمعي

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- **Node.js** 18.0 أو أحدث ([تحميل](https://nodejs.org/))
- **npm** أو **yarn** أو **pnpm**
- **Backend API** يعمل على `http://localhost:5000`

## 🚀 خطوات التثبيت

### 1. تحميل المشروع

```bash
cd d:/زنوبيا/prog
```

### 2. تثبيت المكتبات

```bash
npm install
```

أو إذا كنت تستخدم yarn:
```bash
yarn install
```

أو pnpm:
```bash
pnpm install
```

### 3. إعداد ملف البيئة

انسخ ملف `.env.local.example` إلى `.env.local`:

**Windows:**
```bash
copy .env.local.example .env.local
```

**macOS/Linux:**
```bash
cp .env.local.example .env.local
```

ثم افتح `.env.local` وتأكد من إعداد URL الخاص بالـ API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. تشغيل المشروع

#### وضع التطوير (Development)
```bash
npm run dev
```

سيعمل المشروع على: **http://localhost:3000**

#### وضع الإنتاج (Production)
```bash
# البناء
npm run build

# التشغيل
npm start
```

## 🔧 حل المشاكل الشائعة

### المشكلة 1: Port 3000 مستخدم
إذا كان port 3000 مستخدماً، Next.js سيسألك إذا كنت تريد استخدام port آخر، أو يمكنك تحديد port يدوياً:

```bash
PORT=3001 npm run dev
```

### المشكلة 2: خطأ في CORS
تأكد من أن Backend API يسمح بطلبات من `http://localhost:3000`:

في Backend (Express مثلاً):
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

### المشكلة 3: خطأ في المصادقة
تأكد من:
- Backend API يعمل على `http://localhost:5000`
- Endpoints المصادقة متاحة: `/api/auth/login`, `/api/auth/register`
- Token يُرجع بشكل صحيح

### المشكلة 4: خطأ في Zustand persist
احذف localStorage وأعد تحميل الصفحة:

في Developer Console (F12):
```javascript
localStorage.clear()
location.reload()
```

## 📱 اختبار المشروع

### 1. تسجيل حساب جديد
1. افتح http://localhost:3000
2. سيتم التوجيه تلقائياً إلى صفحة Login
3. اضغط على "أنشئ حساب هنا"
4. املأ البيانات وسجل

### 2. تجربة الأنشطة

#### الاستبيانات:
- اذهب إلى "الاستبيانات" من القائمة العلوية
- صوّت على أحد الخيارات (+5 نقاط)

#### المقالات:
- اذهب إلى "مكتبة المقالات"
- اختر مقالاً واقرأه
- أجب على الاختبار (+5 نقاط قراءة + 10 نقاط اختبار)

#### الألعاب:
- اذهب إلى "الألعاب"
- العب Puzzle أو Crossword (+15 نقطة)

#### الملف الشخصي:
- اضغط على أيقونة User في القائمة
- شاهد نقاطك وإنجازاتك

## 🎨 تخصيص المشروع

### تغيير الألوان

افتح `app/globals.css` وعدّل المتغيرات:

```css
:root {
  --primary: 209 78% 58%; /* اللون الأساسي */
  --success: 122 39% 49%; /* لون النجاح */
  /* ... */
}
```

### إضافة ترجمة جديدة

1. افتح `i18n/ar.json` أو `i18n/en.json`
2. أضف المفتاح الجديد:
```json
{
  "common": {
    "newKey": "قيمة جديدة"
  }
}
```
3. استخدمه في الكود:
```tsx
const { t } = useTranslation()
const text = t('common.newKey')
```

### إضافة صفحة جديدة

1. أنشئ مجلد في `app/`:
```bash
mkdir app/new-page
```

2. أنشئ `page.tsx`:
```tsx
'use client'

export default function NewPage() {
  return <div>صفحة جديدة</div>
}
```

3. أنشئ `layout.tsx` (اختياري):
```tsx
import { Navbar } from '@/components/navbar'

export default function NewPageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">{children}</main>
    </div>
  )
}
```

## 🔐 نصائح الأمان

### للتطوير:
- استخدم `.env.local` ولا ترفعه على Git
- Token يُحفظ في localStorage (للتطوير فقط)

### للإنتاج:
- استخدم HTTPS
- فعّل HTTP-only cookies للـ tokens
- استخدم متغيرات بيئة آمنة
- فعّل Rate Limiting في Backend

## 📊 مراقبة الأداء

### Development Tools:
```bash
# تحليل حجم الـ bundle
npm run build
# النتيجة ستظهر تلقائياً
```

### React DevTools:
- ثبّت [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- افتح Developer Tools (F12)
- اذهب إلى تبويب "Components" أو "Profiler"

## 🌐 نشر المشروع (Deployment)

### Vercel (موصى به):
```bash
npm install -g vercel
vercel
```

### Netlify:
```bash
npm run build
# ارفع مجلد .next على Netlify
```

### Docker:
```bash
# قريباً - سيتم إضافة Dockerfile
```

## 📞 الدعم والمساعدة

إذا واجهت مشكلة:
1. تحقق من [BACKEND_NOTES.md](./BACKEND_NOTES.md) للتأكد من أن Backend متوافق
2. افتح Developer Console (F12) وشاهد الأخطاء
3. تحقق من Network tab لرؤية طلبات API
4. راجع ملف [README.md](./README.md)

## ✅ Checklist قبل البدء

- [ ] Node.js 18+ مثبت
- [ ] Backend API يعمل على port 5000
- [ ] تم تشغيل `npm install`
- [ ] ملف `.env.local` موجود ومعدّل
- [ ] تم اختبار تسجيل الدخول

---

**ملاحظة:** هذا المشروع تم تطويره باستخدام Next.js 14 مع App Router. تأكد من متابعة [Next.js Docs](https://nextjs.org/docs) لأي تحديثات.
