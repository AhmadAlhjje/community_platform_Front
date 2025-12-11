# كود تحسينات الصفحات المتبقية

## ✅ ما تم إنجازه:
1. ✅ Logo في Navbar Dashboard
2. ✅ صفحة Dashboard - Hero Section + Cards بصور خلفية
3. ✅ صفحة الألعاب - Hero Section + Cards محسّنة

---

## 📄 صفحة المقالات `/articles`

### التحسينات المطلوبة:
1. Hero Section مع صورة خلفية
2. Cards بصور خلفية
3. شارات "جديد" للمقالات الحديثة
4. تأثيرات hover متقدمة
5. أيقونات قراءة متحركة

### الكود المطلوب إضافته:

```tsx
// في بداية الملف:
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

// Hero Section (استبدل الـ Header الحالي):
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative rounded-2xl overflow-hidden p-8 md:p-12 mb-8"
  style={{
    backgroundImage: 'url(/images/OIP1.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

  <div className="relative space-y-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-5 w-5 text-primary" />
      </motion.div>
      <span className="text-primary font-semibold">مقالات توعوية قيّمة!</span>
    </motion.div>

    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
      اقرأ وتعلم واختبر <span className="text-primary">معلوماتك!</span>
    </h1>
    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
      مقالات توعوية شاملة مع أسئلة تفاعلية لاختبار فهمك
    </p>
  </div>
</motion.div>

// في ArticleCard:
<Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 cursor-pointer">
  {/* صورة الخلفية */}
  <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
    <Image
      src="/images/OIP1.webp"
      alt={article.title}
      fill
      className="object-cover"
    />
  </div>
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-background/95 group-hover:via-background/85 transition-all duration-300" />

  {/* باقي محتوى الكارد */}
</Card>
```

---

## 📊 صفحة الاستبيانات `/polls`

### التحسينات المطلوبة:
1. Hero Section
2. تأثيرات voting animation
3. Progress bars ملونة
4. شارات الحالة (نشط، منتهي، جديد)

### الكود المطلوب:

```tsx
// Hero Section:
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative rounded-2xl overflow-hidden p-8 md:p-12 mb-8"
  style={{
    backgroundImage: 'url(/images/OIP2.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

  <div className="relative space-y-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageSquare className="h-5 w-5 text-primary" />
      </motion.div>
      <span className="text-primary font-semibold">شارك برأيك!</span>
    </motion.div>

    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
      صوّت وشارك في <span className="text-primary">القرارات!</span>
    </h1>
    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
      استبيانات مجتمعية لمعرفة آراء الجميع وبناء مستقبل أفضل
    </p>
  </div>
</motion.div>

// في PollCard:
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
>
  <Card className="relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <Image src="/images/OIP2.jpeg" fill className="object-cover" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/95 to-background/98" />

    {/* محتوى الاستبيان */}
  </Card>
</motion.div>
```

---

## 👤 صفحة الملف الشخصي `/profile`

### التحسينات المطلوبة:
1. صورة Cover مع parallax
2. Avatar متحرك
3. Cards للإحصائيات
4. Badges للإنجازات

### الكود المطلوب:

```tsx
// Cover Image Section:
<div
  className="relative h-48 md:h-64 w-full"
  style={{
    backgroundImage: 'url(/images/hero-community.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }}
>
  <div className="absolute inset-0 bg-black/30" />
</div>

// Avatar Section:
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring" }}
  className="relative -mt-16 md:-mt-20"
>
  <motion.div
    whileHover={{ scale: 1.05, rotate: 5 }}
    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl"
  >
    <User className="h-16 w-16 md:h-20 md:w-20 text-white" />
  </motion.div>
</motion.div>

// Stats Cards:
<div className="grid gap-4 md:grid-cols-4">
  {[
    { icon: BookOpen, label: 'المقالات', value: stats.articles, color: 'blue' },
    { icon: Gamepad2, label: 'الألعاب', value: stats.games, color: 'green' },
    { icon: MessageSquare, label: 'الاستبيانات', value: stats.polls, color: 'purple' },
    { icon: Trophy, label: 'النقاط', value: user.points, color: 'amber' },
  ].map((stat, index) => (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/OIP1.webp" fill className="object-cover" />
        </div>
        <CardContent className="relative pt-6">
          <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-3`}>
            <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

---

## 🏆 صفحة لوحة الصدارة `/leaderboard`

### التحسينات المطلوبة:
1. Hero Section
2. أيقونات الميداليات (🥇🥈🥉)
3. تأثير glow على المراكز الأولى
4. Spotlight على المستخدم الحالي

### الكود المطلوب:

```tsx
// Hero Section:
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative rounded-2xl overflow-hidden p-8 md:p-12 mb-8"
  style={{
    backgroundImage: 'url(/images/OIP1.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

  <div className="relative space-y-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-full border border-amber-200/50"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Trophy className="h-5 w-5 text-amber-600" />
      </motion.div>
      <span className="text-amber-700 dark:text-amber-400 font-semibold">تنافس مع الأفضل!</span>
    </motion.div>

    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
      لوحة <span className="text-amber-600">الصدارة</span>
    </h1>
    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
      شاهد ترتيب أفضل المستخدمين وتنافس للوصول إلى القمة
    </p>
  </div>
</motion.div>

// User Row (للمراكز الثلاثة الأولى):
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
  whileHover={{ scale: 1.02 }}
  className={`relative ${
    rank === 1 ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20' :
    rank === 2 ? 'bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20' :
    rank === 3 ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20' :
    'bg-card'
  } p-4 rounded-xl border ${isCurrentUser ? 'border-primary shadow-lg' : 'border-border'}`}
>
  {rank <= 3 && (
    <motion.div
      animate={{
        scale: rank === 1 ? [1, 1.1, 1] : [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      className="absolute -left-2 -top-2 text-4xl"
    >
      {rank === 1 && '🥇'}
      {rank === 2 && '🥈'}
      {rank === 3 && '🥉'}
    </motion.div>
  )}

  <div className="flex items-center gap-4">
    <div className="text-2xl font-bold text-muted-foreground w-8">
      #{rank}
    </div>

    <div className="flex-1">
      <p className="font-bold">{user.name}</p>
    </div>

    <div className="flex items-center gap-2">
      <Trophy className="h-5 w-5 text-amber-600" />
      <span className="text-xl font-bold text-amber-600">{user.points}</span>
    </div>
  </div>
</motion.div>
```

---

## 📧 صفحة تواصل معنا `/contact`

### التحسينات المطلوبة:
1. Hero Section مع صورة
2. Form بتصميم جميل
3. أيقونات معلومات التواصل

### الكود المطلوب:

```tsx
// Hero Section:
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative rounded-2xl overflow-hidden p-8 md:p-12 mb-8"
  style={{
    backgroundImage: 'url(/images/OIP2.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

  <div className="relative space-y-4">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
      تواصل <span className="text-primary">معنا</span>
    </h1>
    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
      نحن هنا للإجابة على استفساراتك ومساعدتك
    </p>
  </div>
</motion.div>

// Contact Info Cards:
<div className="grid gap-6 md:grid-cols-3 mb-8">
  {[
    { icon: Mail, title: 'البريد الإلكتروني', value: 'info@example.com', color: 'blue' },
    { icon: Phone, title: 'الهاتف', value: '+966 XX XXX XXXX', color: 'green' },
    { icon: MapPin, title: 'الموقع', value: 'الرياض، المملكة العربية السعودية', color: 'red' },
  ].map((item, index) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/hero-community.webp" fill className="object-cover" />
        </div>
        <CardContent className="relative pt-6 text-center">
          <div className={`w-12 h-12 mx-auto rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center mb-3`}>
            <item.icon className={`h-6 w-6 text-${item.color}-600`} />
          </div>
          <h3 className="font-bold mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.value}</p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

---

## 🎨 ملاحظات التنفيذ

1. **جميع الصفحات** تحتاج:
   - Hero Section مع صورة خلفية
   - Cards بصور خلفية شفافة (opacity: 10-20%)
   - تأثيرات hover (scale, y translation)
   - أيقونات متحركة
   - gradients لضمان وضوح النصوص

2. **الصور المستخدمة**:
   - `/images/hero-community.webp`
   - `/images/OIP1.webp`
   - `/images/OIP2.jpeg`
   - `/images/logo.jpg`

3. **الحركات**:
   - `whileHover`: للتفاعل
   - `animate`: للحركات المستمرة
   - `transition`: للانتقالات السلسة
   - `delay`: لتسلسل الظهور

4. **الألوان والتدرجات**:
   - `from-background/95 via-background/85 to-background/60`
   - `from-primary/10 via-background/90 to-background/95`

---

✨ **تم إنشاء هذا الدليل لمساعدتك في تحسين جميع الصفحات بشكل موحد وجميل!**
