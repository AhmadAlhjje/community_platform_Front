# تعليمات رفع المشروع على السيرفر باستخدام Docker

## المتطلبات
- Docker و Docker Compose مثبتين على السيرفر
- الوصول إلى السيرفر عبر SSH

## خطوات الرفع

### 1. رفع الملفات إلى السيرفر
```bash
# نقل الملفات إلى السيرفر
scp -r . user@161.97.156.42:/path/to/project
```

أو استخدام Git:
```bash
# على السيرفر
git clone <repository-url>
cd community_platform_Front
```

### 2. بناء وتشغيل الـ Container

```bash
# بناء الـ image وتشغيل الـ container
docker-compose up -d --build
```

### 3. التحقق من عمل المشروع

```bash
# عرض logs
docker-compose logs -f

# التحقق من الـ containers العاملة
docker-compose ps
```

### 4. الوصول إلى المشروع
- المشروع سيعمل على: `http://161.97.156.42:4001`
- الـ API على: `http://161.97.156.42:4000`

## أوامر مفيدة

### إيقاف المشروع
```bash
docker-compose down
```

### إعادة تشغيل المشروع
```bash
docker-compose restart
```

### إعادة البناء بعد التعديلات
```bash
docker-compose down
docker-compose up -d --build
```

### عرض الـ logs
```bash
# عرض جميع الـ logs
docker-compose logs -f

# عرض آخر 100 سطر
docker-compose logs --tail=100
```

### حذف الـ container والـ images
```bash
docker-compose down --rmi all
```

## تحديث متغيرات البيئة

لتغيير عنوان الـ API أو أي متغير آخر، عدل ملف [docker-compose.yml](docker-compose.yml):

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://161.97.156.42:4000
```

ثم أعد تشغيل المشروع:
```bash
docker-compose down
docker-compose up -d
```

## استكشاف الأخطاء

### الـ Container لا يعمل
```bash
# عرض جميع الـ containers
docker ps -a

# عرض logs للأخطاء
docker-compose logs
```

### البورت مستخدم
```bash
# التحقق من البورت
netstat -tlnp | grep 4001

# قتل العملية إذا لزم الأمر
kill -9 <PID>
```

### مشاكل في الاتصال بالـ API
تأكد من:
- الـ backend يعمل على البورت 4000
- Firewall يسمح بالاتصال بين الـ containers
- عنوان الـ API صحيح في docker-compose.yml
