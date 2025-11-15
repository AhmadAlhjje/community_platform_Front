# ملاحظات وتعديلات مطلوبة للباك إند

## 🔴 تعديلات حرجة ومطلوبة بشكل عاجل

### 1. نظام الاستبيان (Polls) - النشاط الأول

#### المشكلة الحالية:
- حسب ملف Postman، نظام الـ Polls الحالي لا يدعم **استبيان واحد فعال** مع حالات متعددة

#### التعديلات المطلوبة:

**A. إضافة حقول جديدة لجدول `polls`:**
```sql
ALTER TABLE polls ADD COLUMN status ENUM('active', 'voting_ended', 'waiting_for_meeting', 'meeting_active', 'completed') DEFAULT 'active';
ALTER TABLE polls ADD COLUMN meet_link VARCHAR(500) NULL;
ALTER TABLE polls ADD COLUMN scheduled_date DATETIME NULL;
ALTER TABLE polls ADD COLUMN meeting_duration INT NULL; -- بالدقائق
```

**B. تعديل endpoint لجلب الاستبيان النشط:**
- بدلاً من إرجاع قائمة polls، يجب إرجاع استبيان واحد فقط
- Endpoint: `GET /api/polls/active`
- Response:
```json
{
  "poll": {
    "id": "poll-id",
    "question": "ما هي المشكلة التي تود مناقشتها؟",
    "options": ["مشكلة 1", "مشكلة 2", "مشكلة 3"],
    "votes": { "مشكلة 1": 15, "مشكلة 2": 8, "مشكلة 3": 20 },
    "endDate": "2025-12-31T23:59:59Z",
    "status": "active",
    "meetLink": null,
    "scheduledDate": null,
    "hasVoted": false,
    "userVote": null
  }
}
```

**C. إضافة endpoint لتحديث حالة الاستبيان (Admin فقط):**
```
PUT /api/polls/:id/status
Body: {
  "status": "meeting_active",
  "meetLink": "https://meet.google.com/abc-defg-hij",
  "scheduledDate": "2025-12-01T15:00:00Z",
  "meetingDuration": 120
}
```

**D. تعديل جدول `poll_votes`:**
```sql
CREATE TABLE IF NOT EXISTS poll_votes (
  id VARCHAR(36) PRIMARY KEY,
  poll_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  selected_option VARCHAR(255) NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_poll (user_id, poll_id)
);
```

**E. منطق التحقق من التصويت:**
- عند استدعاء `GET /api/polls/active`، يجب التحقق إذا كان المستخدم قد صوّت مسبقاً
- إرجاع `hasVoted: true` و `userVote: "المشكلة المختارة"` إذا صوّت

---

### 2. نظام الجلسات الحوارية (Discussion Sessions)

#### المشكلة:
- لا يوجد ربط بين الـ Poll والـ Discussion Session

#### التعديلات المطلوبة:

**A. دمج نظام الجلسات مع الاستبيانات:**
- يمكن الاحتفاظ بجدول `discussion_sessions` منفصل أو دمجه مع `polls`
- الخيار الأفضل: دمجهم في جدول واحد (polls) كما هو مقترح أعلاه

**B. إذا تم الفصل، إضافة حقل:**
```sql
ALTER TABLE discussion_sessions ADD COLUMN poll_id VARCHAR(36) NULL;
ALTER TABLE discussion_sessions ADD COLUMN status ENUM('upcoming', 'active', 'ended') DEFAULT 'upcoming';
```

**C. Endpoint لتسجيل الحضور:**
```
POST /api/discussions/:id/attend
Response: {
  "message": "تم تسجيل الحضور بنجاح",
  "pointsEarned": 20
}
```
- يجب منع تسجيل الحضور أكثر من مرة للجلسة نفسها

---

### 3. نظام المقالات والاستبيانات (Articles + Surveys)

#### المشكلة:
- لا توجد آلية لتتبع ما إذا كان المستخدم قد قرأ المقال أو أجاب على الاستبيان

#### التعديلات المطلوبة:

**A. إنشاء جدول `article_reads`:**
```sql
CREATE TABLE article_reads (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  article_id VARCHAR(36) NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  survey_completed BOOLEAN DEFAULT FALSE,
  survey_score INT NULL,
  survey_passed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_article (user_id, article_id)
);
```

**B. تعديل endpoint `POST /api/articles/:id/read`:**
- يجب إضافة سجل في `article_reads`
- إضافة 5 نقاط للمستخدم
- منع القراءة المتكررة (إضافة نقاط مرة واحدة فقط)

**C. تعديل endpoint `POST /api/surveys/:id/submit`:**
Response المطلوب:
```json
{
  "result": {
    "score": 8,
    "totalQuestions": 10,
    "percentage": 80,
    "passed": true,
    "pointsEarned": 10
  }
}
```
- إضافة 10 نقاط فقط إذا كان `percentage >= 70`
- منع إعادة الاختبار (التحقق من `article_reads.survey_completed`)
- **لا ترجع الإجابات الصحيحة**، فقط النتيجة

**D. عند جلب المقالات `GET /api/articles`:**
```json
{
  "articles": [
    {
      "id": "article-id",
      "title": "عنوان المقال",
      "content": "...",
      "hasRead": true,
      "surveyCompleted": true
    }
  ]
}
```

---

### 4. نظام الألعاب (Games)

#### التعديلات المطلوبة:

**A. إنشاء جدول `game_completions`:**
```sql
CREATE TABLE game_completions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  game_id VARCHAR(36) NOT NULL,
  score INT NOT NULL,
  completion_time INT NOT NULL, -- بالثواني
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  points_earned INT DEFAULT 15,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_game (user_id, game_id)
);
```

**B. endpoint `POST /api/games/:id/complete`:**
- يجب التحقق من عدم وجود completion سابق
- إضافة 15 نقطة للمستخدم
- منع إعادة اللعب لنفس اللعبة

**C. عند جلب الألعاب `GET /api/games`:**
```json
{
  "games": [
    {
      "id": "game-id",
      "title": "لعبة البازل",
      "type": "puzzle",
      "isCompleted": false
    }
  ]
}
```

**D. بنية gameData للألعاب:**

للـ Puzzle:
```json
{
  "imageUrl": "https://example.com/puzzle-image.jpg",
  "pieces": 16
}
```

للـ Crossword:
```json
{
  "clues": [
    {
      "number": 1,
      "direction": "across",
      "clue": "نص السؤال",
      "answer": "الإجابة الصحيحة"
    }
  ]
}
```

---

### 5. نظام النقاط (Points System)

#### Endpoint جديد مطلوب:

**A. `GET /api/users/:id/points`**
Response:
```json
{
  "points": 150,
  "breakdown": {
    "articles": 45,
    "games": 60,
    "polls": 25,
    "discussions": 20
  }
}
```

**B. `GET /api/users/:id/activity`**
Response:
```json
{
  "activity": {
    "articlesRead": [
      {
        "articleId": "id",
        "articleTitle": "عنوان المقال",
        "completedAt": "2025-11-14T10:00:00Z",
        "surveyPassed": true
      }
    ],
    "puzzlesSolved": [...],
    "crosswordsSolved": [...],
    "pollsVoted": [...],
    "meetingsAttended": [...]
  }
}
```

---

### 6. نظام Leaderboard

#### Endpoint:
`GET /api/users/leaderboard`

Response:
```json
[
  {
    "userId": "user-id",
    "userName": "أحمد محمد",
    "points": 250,
    "rank": 1
  },
  {
    "userId": "user-id-2",
    "userName": "فاطمة علي",
    "points": 200,
    "rank": 2
  }
]
```

---

## ⚠️ ملاحظات إضافية

### 1. التحقق من التصويت/الحضور/الإكمال
يجب التأكد من:
- ✅ المستخدم لا يمكنه التصويت أكثر من مرة في نفس الاستبيان
- ✅ المستخدم لا يمكنه تسجيل الحضور أكثر من مرة في نفس الجلسة
- ✅ المستخدم لا يمكنه إعادة اختبار المقال
- ✅ المستخدم لا يمكنه إعادة لعب نفس اللعبة

### 2. إضافة النقاط
يجب إضافة النقاط فقط في الحالات التالية:
- قراءة مقال: +5 نقاط (مرة واحدة)
- اجتياز اختبار المقال (70%+): +10 نقاط (مرة واحدة)
- التصويت في استبيان: +5 نقاط (مرة واحدة لكل استبيان)
- حضور جلسة: +20 نقطة (مرة واحدة لكل جلسة)
- إكمال لعبة: +15 نقطة (مرة واحدة لكل لعبة)

### 3. إرجاع بيانات المستخدم
عند تسجيل الدخول أو جلب الملف الشخصي، يجب تحديث حقل `points` في جدول `users` بشكل تلقائي عند أي عملية تضيف نقاطاً.

### 4. حالات الاستبيان (Poll States)
النظام يجب أن يدعم:
1. **voting_active**: التصويت نشط
2. **voting_ended**: انتهى التصويت، بانتظار الجلسة
3. **meeting_active**: الجلسة نشطة ورابط Meet متوفر
4. **completed**: انتهت الجلسة
5. **waiting_for_next**: لا يوجد استبيان نشط

---

## ✅ ما هو موجود بشكل صحيح

- ✅ Authentication (Login/Register)
- ✅ Categories CRUD
- ✅ Articles CRUD
- ✅ Surveys structure
- ✅ Basic Games structure
- ✅ Basic Polls structure

---

## 📝 أولويات التنفيذ

### أولوية عالية (Critical):
1. تعديل نظام Polls ليدعم استبيان واحد نشط مع حالات متعددة
2. إضافة جداول التتبع (article_reads, game_completions, poll_votes)
3. منع التكرار في جميع الأنشطة
4. نظام إضافة النقاط

### أولوية متوسطة:
5. Endpoint لـ User Activity
6. Endpoint لـ Points Breakdown
7. Leaderboard endpoint

### أولوية منخفضة:
8. تحسينات على الأداء
9. Caching

---

## 🔄 Endpoints مفقودة تماماً

1. `GET /api/polls/active` - جلب الاستبيان النشط
2. `PUT /api/polls/:id/status` - تحديث حالة الاستبيان (Admin)
3. `GET /api/users/:id/activity` - جلب أنشطة المستخدم
4. `GET /api/users/:id/points` - جلب تفاصيل نقاط المستخدم

---

## 💡 اقتراحات للتحسين

1. إضافة Notifications system لإشعار المستخدمين عند:
   - إضافة استبيان جديد
   - توفر رابط الجلسة
   - إضافة مقال جديد

2. إضافة حقل `phone` في جدول users (مذكور في المتطلبات لكن غير موجود في Postman)

3. إضافة pagination للمقالات والألعاب

---

**ملاحظة نهائية:** جميع التعديلات المذكورة أعلاه ضرورية لكي يعمل الفرونت إند بشكل صحيح. يرجى مراجعة كل قسم بعناية وتطبيق التعديلات.
