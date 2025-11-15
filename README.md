# منصة تعزيز الوعي المجتمعي - Frontend

مشروع Next.js 14 مع TypeScript لمنصة تعزيز الوعي المجتمعي التفاعلية.

## 🚀 المميزات

- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ TailwindCSS + shadcn/ui
- ✅ Framer Motion للانيميشن
- ✅ i18n (العربية والإنجليزية)
- ✅ Dark/Light Mode
- ✅ نظام مصادقة كامل (JWT)
- ✅ نظام النقاط والصدارة
- ✅ 3 أنشطة رئيسية:
  - الاستبيانات + جلسات Google Meet
  - مكتبة المقالات + اختبارات MCQ
  - الألعاب (Puzzle + Crossword)

## 📁 بنية المشروع

```
prog/
├── app/                      # صفحات Next.js (App Router)
│   ├── auth/                # صفحات المصادقة
│   ├── dashboard/           # الصفحة الرئيسية
│   ├── articles/            # مكتبة المقالات
│   ├── games/               # صفحات الألعاب
│   ├── polls/               # الاستبيانات والجلسات
│   ├── profile/             # الملف الشخصي
│   └── leaderboard/         # لوحة الصدارة
├── components/              # المكونات القابلة لإعادة الاستخدام
│   ├── ui/                  # مكونات shadcn/ui
│   └── providers/           # Context Providers
├── hooks/                   # Custom Hooks
│   ├── use-auth.ts         # Authentication hook
│   ├── use-translation.ts  # i18n hook
│   └── use-toast.ts        # Toast notifications
├── lib/                     # Utilities
│   ├── api-client.ts       # API Client
│   └── store/              # Zustand stores
│       ├── auth-store.ts
│       ├── theme-store.ts
│       └── language-store.ts
├── types/                   # TypeScript types
│   └── api.ts              # API types
├── i18n/                    # ملفات الترجمة
│   ├── ar.json
│   └── en.json
└── middleware.ts            # Next.js middleware للحماية

```

## 🔧 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn أو pnpm

### خطوات التثبيت

1. **تثبيت المكتبات:**
```bash
npm install
```

2. **إعداد متغيرات البيئة:**
```bash
cp .env.local.example .env.local
```

ثم عدّل `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **تشغيل المشروع:**
```bash
# وضع التطوير
npm run dev

# البناء للإنتاج
npm run build

# تشغيل النسخة المبنية
npm start
```

4. **فتح المتصفح:**
```
http://localhost:3000
```

## 🎨 الألوان

### Light Mode
- Primary Blue: `#4A90E2`
- Primary Green: `#4CAF50`
- Background: `#F7F9FC`
- Card: `#FFFFFF`

### Dark Mode
- Background: `#121417`
- Card: `#1E2125`
- Primary Blue: `#5AA8FF`
- Primary Green: `#5EC76B`

## 📱 الصفحات الرئيسية

### للمستخدمين
- `/auth/login` - تسجيل الدخول
- `/auth/register` - إنشاء حساب
- `/dashboard` - الصفحة الرئيسية
- `/articles` - مكتبة المقالات
- `/articles/[id]` - عرض مقال + اختبار
- `/games` - صفحة الألعاب
- `/games/puzzle/[id]` - لعبة البازل
- `/games/crossword/[id]` - الكلمات المتقاطعة
- `/polls` - الاستبيانات والجلسات
- `/profile` - الملف الشخصي
- `/leaderboard` - لوحة الصدارة

## 🔐 المصادقة

المشروع يستخدم JWT للمصادقة:
- Token يُحفظ في localStorage
- Middleware يحمي جميع الصفحات ما عدا `/auth/*`
- Auto-redirect للمستخدمين المسجلين

## 🌍 التعدد اللغوي (i18n)

- دعم العربية والإنجليزية
- RTL/LTR تلقائي
- ملفات JSON منفصلة للترجمات

استخدام:
```tsx
import { useTranslation } from '@/hooks/use-translation'

const { t } = useTranslation()
const title = t('common.appName')
```

## 🎮 نظام الأنشطة

### 1. الاستبيانات + Google Meet
- استبيان واحد نشط في كل دورة
- 4 حالات: التصويت النشط، انتظار الجلسة، الجلسة النشطة، انتظار استبيان جديد
- +5 نقاط للتصويت
- +20 نقطة لحضور الجلسة

### 2. المقالات + MCQ
- تصنيفات متعددة
- +5 نقاط للقراءة
- +10 نقاط لاجتياز الاختبار (70%+)
- منع إعادة الاختبار

### 3. الألعاب
- Puzzle Game (بازل الصور)
- Crossword (الكلمات المتقاطعة)
- +15 نقطة لإكمال كل لعبة
- منع إعادة اللعب

## 🔔 نظام الإشعارات

استخدام toast notifications:
```tsx
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

toast({
  title: 'نجح',
  description: 'تمت العملية بنجاح',
  variant: 'success'
})
```

## 📊 API Integration

جميع الطلبات تستخدم `apiClient`:

```tsx
import { apiClient } from '@/lib/api-client'

// GET request
const data = await apiClient.get<ResponseType>('/api/endpoint')

// POST request with auth
const data = await apiClient.post<ResponseType>(
  '/api/endpoint',
  { body: 'data' },
  true // requiresAuth
)
```

## 🛠️ Technologies Used

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Animation:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Fonts:** Cairo (Arabic/Latin)

## 📝 ملاحظات مهمة

1. **Middleware:** يحمي جميع الصفحات تلقائياً
2. **Types:** جميع الـ API types موجودة في `types/api.ts`
3. **Responsive:** جميع الصفحات responsive بالكامل
4. **Accessibility:** دعم RTL/LTR و keyboard navigation

## 🐛 معالجة الأخطاء

جميع الأخطاء يتم التعامل معها:
- عرض toast notification
- Logging في console
- Graceful fallback UI

## 📄 الملفات المهمة

- `BACKEND_NOTES.md` - ملاحظات وتعديلات مطلوبة للباك إند
- `middleware.ts` - حماية المسارات
- `types/api.ts` - جميع الـ TypeScript types
- `lib/api-client.ts` - HTTP client wrapper

## 🤝 المساهمة

للمساهمة في المشروع:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 الدعم

للأسئلة والدعم، يرجى فتح Issue في GitHub.

---

**تم التطوير بواسطة:** Claude Code
**الإصدار:** 1.0.0
**آخر تحديث:** نوفمبر 2025
