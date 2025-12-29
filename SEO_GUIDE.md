# دليل تحسين محركات البحث (SEO) - صوتنا يبني

## التحسينات المنفذة

### 1. Metadata المحسّنة
تم إضافة metadata شاملة في `app/layout.tsx` تشمل:
- عنوان ديناميكي مع template
- وصف محسّن للموقع
- كلمات مفتاحية عربية وإنجليزية
- Open Graph tags لمشاركات وسائل التواصل الاجتماعي
- Twitter Cards
- Canonical URLs
- Robots meta tags

### 2. ملف robots.txt
موقع: `public/robots.txt`

يتحكم في كيفية فهرسة محركات البحث للموقع:
- يسمح بفهرسة الصفحات العامة
- يمنع فهرسة صفحات الـ API والإدارة
- يشير إلى موقع sitemap

### 3. Sitemap ديناميكي
موقع: `app/sitemap.ts`

يتم إنشاؤه تلقائياً ويتضمن:
- جميع الصفحات العامة
- أولويات مختلفة للصفحات
- تحديث تلقائي

الوصول: `https://your-domain.com/sitemap.xml`

### 4. Structured Data (JSON-LD)
موقع: `components/seo/structured-data.tsx`

يوفر معلومات منظمة لمحركات البحث:
- بيانات الموقع (WebSite)
- بيانات المنظمة (Organization)
- بيانات المقالات (Article)
- بيانات الألعاب (Game)

## الخطوات التالية للتطبيق

### 1. تحديث متغيرات البيئة
انسخ `.env.example` إلى `.env.local` وحدث القيم:

```bash
cp .env.example .env.local
```

ثم عدّل القيم:
```env
NEXT_PUBLIC_SITE_URL=https://sotonayabni.org
NEXT_PUBLIC_API_URL=https://api.sotonayabni.org
```

### 2. تسجيل الموقع في Google Search Console

1. اذهب إلى [Google Search Console](https://search.google.com/search-console)
2. أضف موقعك
3. احصل على رمز التحقق
4. حدّث `app/layout.tsx` مع رمز التحقق:

```typescript
verification: {
  google: 'your-actual-verification-code',
}
```

### 3. إرسال Sitemap لمحركات البحث

#### Google Search Console:
1. افتح Google Search Console
2. اختر موقعك
3. اذهب إلى "Sitemaps" من القائمة الجانبية
4. أضف URL: `https://sotonayabni.org/sitemap.xml`

#### Bing Webmaster Tools:
1. اذهب إلى [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. أضف موقعك
3. أرسل sitemap

### 4. إضافة روابط وسائل التواصل الاجتماعي

حدّث `components/seo/structured-data.tsx`:

```typescript
sameAs: [
  'https://twitter.com/your-handle',
  'https://facebook.com/your-page',
  'https://instagram.com/your-account',
  'https://linkedin.com/company/your-company'
],
```

### 5. إنشاء صورة Open Graph مخصصة

أنشئ صورة بحجم `1200x630` بكسل:
- احفظها في `public/images/og-image.png`
- حدّث `app/layout.tsx`:

```typescript
images: [
  {
    url: '/images/og-image.png',
    width: 1200,
    height: 630,
    alt: 'صوتنا يبني - منصة تفاعلية للوعي المجتمعي',
  },
],
```

### 6. إضافة Metadata للصفحات الفردية

مثال لصفحة المقالات (`app/articles/[id]/page.tsx`):

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // جلب بيانات المقال
  const article = await fetchArticle(params.id)

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
    },
  }
}
```

## نصائح إضافية لتحسين SEO

### 1. المحتوى
- استخدم عناوين وصفية (H1, H2, H3)
- أضف نصوص بديلة (alt text) لجميع الصور
- اكتب محتوى أصلي وقيّم
- حافظ على المحتوى محدثاً

### 2. الأداء
- حسّن حجم الصور (استخدم WebP)
- فعّل الضغط (gzip/brotli)
- استخدم lazy loading للصور
- حسّن Core Web Vitals

### 3. الروابط الداخلية
- اربط الصفحات ذات الصلة
- استخدم anchor text وصفي
- أنشئ هيكلية واضحة للموقع

### 4. Mobile-First
- تأكد من أن الموقع متجاوب
- اختبر على أجهزة مختلفة
- استخدم Google Mobile-Friendly Test

### 5. سرعة التحميل
- استخدم CDN
- فعّل caching
- قلل من JavaScript و CSS

## أدوات مفيدة للمراقبة

1. **Google Search Console**: مراقبة الأداء في نتائج البحث
2. **Google Analytics**: تتبع الزوار والتفاعل
3. **PageSpeed Insights**: قياس سرعة الموقع
4. **Schema Markup Validator**: التحقق من structured data
5. **Ahrefs / SEMrush**: تحليل شامل للـ SEO

## الصيانة الدورية

- راجع Google Search Console أسبوعياً
- حدّث المحتوى بانتظام
- تحقق من الروابط المكسورة شهرياً
- راقب أداء الكلمات المفتاحية
- حلل سلوك المستخدمين

## الدعم

للمزيد من المعلومات:
- [Next.js SEO Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
