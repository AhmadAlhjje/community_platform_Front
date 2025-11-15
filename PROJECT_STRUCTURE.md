# بنية المشروع الكاملة

## 📂 هيكل الملفات

```
d:/زنوبيا/prog/
│
├── 📁 app/                                    # صفحات Next.js (App Router)
│   ├── 📄 globals.css                        # ملف الأنماط العامة
│   ├── 📄 layout.tsx                         # Layout الرئيسي
│   ├── 📄 page.tsx                           # الصفحة الرئيسية (redirect)
│   │
│   ├── 📁 auth/                              # صفحات المصادقة
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx                  # صفحة تسجيل الدخول
│   │   └── 📁 register/
│   │       └── 📄 page.tsx                  # صفحة التسجيل
│   │
│   ├── 📁 dashboard/                         # لوحة التحكم
│   │   ├── 📄 layout.tsx                    # Layout مع Navbar
│   │   └── 📄 page.tsx                      # الصفحة الرئيسية
│   │
│   ├── 📁 articles/                          # مكتبة المقالات
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx                      # قائمة المقالات
│   │   └── 📁 [id]/
│   │       └── 📄 page.tsx                  # عرض مقال + MCQ
│   │
│   ├── 📁 games/                             # الألعاب
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx                      # قائمة الألعاب
│   │   ├── 📁 puzzle/
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx              # لعبة البازل
│   │   └── 📁 crossword/
│   │       └── 📁 [id]/
│   │           └── 📄 page.tsx              # الكلمات المتقاطعة
│   │
│   ├── 📁 polls/                             # الاستبيانات
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx                      # استبيان + Google Meet
│   │
│   ├── 📁 profile/                           # الملف الشخصي
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx                      # معلومات وإنجازات
│   │
│   └── 📁 leaderboard/                       # لوحة الصدارة
│       ├── 📄 layout.tsx
│       └── 📄 page.tsx
│
├── 📁 components/                             # المكونات القابلة لإعادة الاستخدام
│   ├── 📄 navbar.tsx                         # شريط التنقل
│   ├── 📄 theme-switcher.tsx                 # مبدل الثيم
│   ├── 📄 language-switcher.tsx              # مبدل اللغة
│   ├── 📄 loading-spinner.tsx                # مؤشر التحميل
│   ├── 📄 empty-state.tsx                    # حالة فارغة
│   │
│   ├── 📁 providers/                         # Context Providers
│   │   └── 📄 theme-provider.tsx            # Theme Provider
│   │
│   └── 📁 ui/                                # مكونات shadcn/ui
│       ├── 📄 button.tsx
│       ├── 📄 card.tsx
│       ├── 📄 input.tsx
│       ├── 📄 label.tsx
│       ├── 📄 toast.tsx
│       ├── 📄 toaster.tsx
│       └── 📄 switch.tsx
│
├── 📁 hooks/                                  # Custom Hooks
│   ├── 📄 use-auth.ts                        # المصادقة
│   ├── 📄 use-translation.ts                 # الترجمة
│   └── 📄 use-toast.ts                       # الإشعارات
│
├── 📁 lib/                                    # Utilities & Helpers
│   ├── 📄 api-client.ts                      # HTTP Client
│   ├── 📄 utils.ts                           # دوال مساعدة
│   │
│   └── 📁 store/                             # Zustand Stores
│       ├── 📄 auth-store.ts                  # حالة المصادقة
│       ├── 📄 theme-store.ts                 # حالة الثيم
│       └── 📄 language-store.ts              # حالة اللغة
│
├── 📁 types/                                  # TypeScript Types
│   └── 📄 api.ts                             # جميع الـ API types
│
├── 📁 i18n/                                   # الترجمات
│   ├── 📄 ar.json                            # العربية
│   └── 📄 en.json                            # الإنجليزية
│
├── 📁 utils/                                  # Utility Functions
│   └── 📄 format-date.ts                     # تنسيق التواريخ
│
├── 📄 middleware.ts                           # Next.js Middleware (حماية)
├── 📄 tailwind.config.ts                      # إعدادات TailwindCSS
├── 📄 tsconfig.json                           # إعدادات TypeScript
├── 📄 next.config.mjs                         # إعدادات Next.js
├── 📄 postcss.config.mjs                      # إعدادات PostCSS
├── 📄 package.json                            # Dependencies
├── 📄 .env.local                              # متغيرات البيئة (local)
├── 📄 .env.local.example                      # مثال للـ env
├── 📄 .gitignore                              # Git ignore
│
├── 📄 README.md                               # دليل المشروع
├── 📄 INSTALLATION_GUIDE.md                   # دليل التثبيت
├── 📄 BACKEND_NOTES.md                        # ملاحظات للباك إند
├── 📄 API_ENDPOINTS.md                        # قائمة Endpoints
└── 📄 PROJECT_STRUCTURE.md                    # هذا الملف
```

## 📊 إحصائيات المشروع

- **إجمالي الصفحات:** 11 صفحة
- **المكونات:** 15+ مكون
- **Custom Hooks:** 3
- **Zustand Stores:** 3
- **API Types:** 30+ type
- **اللغات المدعومة:** 2 (عربي، إنجليزي)

## 🎯 الصفحات الرئيسية

### للزوار (غير مسجلين):
- `/` → يحول إلى `/auth/login`
- `/auth/login` - تسجيل الدخول
- `/auth/register` - إنشاء حساب

### للمستخدمين المسجلين:
- `/dashboard` - الصفحة الرئيسية
- `/articles` - قائمة المقالات
- `/articles/[id]` - قراءة مقال + اختبار
- `/games` - قائمة الألعاب
- `/games/puzzle/[id]` - لعبة البازل
- `/games/crossword/[id]` - الكلمات المتقاطعة
- `/polls` - الاستبيانات + Google Meet
- `/profile` - الملف الشخصي
- `/leaderboard` - لوحة الصدارة

## 🔧 المكونات الأساسية

### UI Components (shadcn/ui):
- `Button` - أزرار بأنماط مختلفة
- `Card` - كروت لعرض المحتوى
- `Input` - حقول الإدخال
- `Label` - تسميات الحقول
- `Toast` - إشعارات منبثقة
- `Switch` - مفاتيح تبديل

### Custom Components:
- `Navbar` - شريط التنقل الرئيسي
- `ThemeSwitcher` - تبديل Light/Dark
- `LanguageSwitcher` - تبديل AR/EN
- `LoadingSpinner` - مؤشر التحميل
- `EmptyState` - حالة فارغة

## 🔐 نظام الحماية

### Middleware Protection:
- جميع الصفحات محمية ما عدا `/auth/*` و `/`
- إعادة توجيه تلقائية للمستخدمين غير المسجلين
- إعادة توجيه للمستخدمين المسجلين من صفحات Auth

### Authentication Flow:
1. المستخدم يسجل الدخول
2. يُحفظ Token في localStorage
3. يُحفظ User في Zustand store
4. Middleware يتحقق من Token
5. الصفحات المحمية تستخدم `useAuth()`

## 🌍 نظام i18n

### كيفية العمل:
- ملفات JSON منفصلة (`ar.json`, `en.json`)
- Hook مخصص: `useTranslation()`
- تبديل RTL/LTR تلقائي
- حفظ اللغة في Zustand

### إضافة ترجمة:
```typescript
// في i18n/ar.json
{
  "section": {
    "key": "القيمة"
  }
}

// في الكود
const { t } = useTranslation()
const text = t('section.key')
```

## 🎨 نظام الثيم

### الألوان:
- **Light Mode:** خلفية فاتحة، ألوان زاهية
- **Dark Mode:** خلفية داكنة، ألوان ناعمة
- تبديل سلس مع Animation
- حفظ الاختيار في localStorage

### CSS Variables:
جميع الألوان معرفة كـ CSS Variables في `globals.css`

## 🔄 تدفق البيانات (Data Flow)

```
User Action
    ↓
Component
    ↓
Custom Hook (use-auth, etc.)
    ↓
API Client
    ↓
Backend API
    ↓
Response
    ↓
Update Zustand Store
    ↓
Re-render Components
```

## 📦 Dependencies الأساسية

### Framework:
- Next.js 14.2.0
- React 18.3.0
- TypeScript 5.4.5

### UI:
- TailwindCSS 3.4.3
- Radix UI (components)
- Framer Motion 11.2.10
- Lucide React (icons)

### State Management:
- Zustand 4.5.2

### Utilities:
- clsx
- tailwind-merge
- class-variance-authority

## 🚀 Scripts المتاحة

```bash
npm run dev      # تشغيل Development
npm run build    # بناء Production
npm start        # تشغيل Production
npm run lint     # فحص الكود
```

## 📝 ملاحظات مهمة

1. **App Router:** المشروع يستخدم Next.js App Router (ليس Pages Router)
2. **TypeScript:** جميع الملفات typed بشكل صحيح
3. **Responsive:** جميع الصفحات mobile-friendly
4. **Accessibility:** دعم RTL/LTR و keyboard navigation
5. **Performance:** Lazy loading و code splitting

## 🔜 ما يمكن إضافته (اختياري)

- [ ] PWA Support
- [ ] Offline Mode
- [ ] Push Notifications
- [ ] Advanced Puzzle/Crossword components
- [ ] Real-time updates (WebSockets)
- [ ] Admin Dashboard
- [ ] Analytics integration
- [ ] Sentry error tracking

---

**تم إنشاء المشروع بواسطة:** Claude Code
**التاريخ:** نوفمبر 2025
**الإصدار:** 1.0.0
