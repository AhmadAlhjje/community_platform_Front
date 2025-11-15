# قائمة Endpoints المستخدمة في Frontend

هذا الملف يوضح جميع API Endpoints التي يستخدمها Frontend حالياً.

## 🔐 Authentication

### Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "123456"
}
```
- **Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "role": "user",
    "points": 0
  }
}
```

### Register
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "123456"
}
```
- **Response:** نفس Login

### Get Profile
- **Method:** `GET`
- **Endpoint:** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "points": 150
  }
}
```

---

## 📚 Categories

### Get All Categories
- **Method:** `GET`
- **Endpoint:** `/api/categories`
- **Response:**
```json
{
  "categories": [
    {
      "id": "cat-id",
      "name": "الصحة العامة",
      "description": "مقالات عن الصحة"
    }
  ]
}
```

---

## 📖 Articles

### Get All Articles
- **Method:** `GET`
- **Endpoint:** `/api/articles`
- **Response:**
```json
{
  "articles": [
    {
      "id": "article-id",
      "title": "عنوان المقال",
      "content": "محتوى المقال...",
      "categoryId": "cat-id",
      "hasRead": false
    }
  ]
}
```

### Get Articles by Category
- **Method:** `GET`
- **Endpoint:** `/api/articles/category/{categoryId}`

### Get Article by ID
- **Method:** `GET`
- **Endpoint:** `/api/articles/{id}`
- **Response:**
```json
{
  "article": {
    "id": "article-id",
    "title": "عنوان المقال",
    "content": "محتوى المقال...",
    "category": {
      "id": "cat-id",
      "name": "الصحة"
    }
  }
}
```

### Mark Article as Read
- **Method:** `POST`
- **Endpoint:** `/api/articles/{id}/read`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "message": "تمت القراءة",
  "pointsEarned": 5
}
```

---

## 📝 Surveys (MCQ)

### Get Survey by Article ID
- **Method:** `GET`
- **Endpoint:** `/api/surveys/article/{articleId}`
- **Response:**
```json
{
  "survey": {
    "id": "survey-id",
    "articleId": "article-id",
    "title": "اختبار المقال",
    "questions": [
      {
        "id": "q1",
        "questionText": "ما هو...؟",
        "options": [
          {
            "id": "opt1",
            "optionText": "خيار 1",
            "isCorrect": true
          }
        ]
      }
    ]
  }
}
```

### Submit Survey
- **Method:** `POST`
- **Endpoint:** `/api/surveys/{surveyId}/submit`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "answers": [
    {
      "questionId": "q1",
      "optionId": "opt1"
    }
  ]
}
```
- **Response:**
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

---

## 🗳️ Polls (Voting)

### Get All Polls
- **Method:** `GET`
- **Endpoint:** `/api/polls`
- **Response:**
```json
{
  "polls": [
    {
      "id": "poll-id",
      "question": "ما هي المشكلة؟",
      "options": ["مشكلة 1", "مشكلة 2"],
      "votes": { "مشكلة 1": 10, "مشكلة 2": 5 },
      "endDate": "2025-12-31T23:59:59Z",
      "hasVoted": false
    }
  ]
}
```

### Vote on Poll
- **Method:** `POST`
- **Endpoint:** `/api/polls/{pollId}/vote`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "option": "مشكلة 1"
}
```
- **Response:**
```json
{
  "message": "تم التصويت",
  "pointsEarned": 5
}
```

---

## 💬 Discussion Sessions

### Get All Sessions
- **Method:** `GET`
- **Endpoint:** `/api/discussions`
- **Response:**
```json
{
  "sessions": [
    {
      "id": "session-id",
      "title": "جلسة حوارية",
      "description": "مناقشة...",
      "meetLink": "https://meet.google.com/abc",
      "scheduledDate": "2025-12-01T15:00:00Z",
      "duration": 120,
      "status": "active"
    }
  ]
}
```

### Mark Attendance
- **Method:** `POST`
- **Endpoint:** `/api/discussions/{sessionId}/attend`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "message": "تم تسجيل الحضور",
  "pointsEarned": 20
}
```

---

## 🎮 Games

### Get All Games
- **Method:** `GET`
- **Endpoint:** `/api/games`
- **Response:**
```json
{
  "games": [
    {
      "id": "game-id",
      "title": "لعبة البازل",
      "description": "وصف اللعبة",
      "type": "puzzle",
      "difficulty": "medium",
      "gameData": {
        "imageUrl": "https://...",
        "pieces": 16
      },
      "isCompleted": false
    }
  ]
}
```

### Get Game by ID
- **Method:** `GET`
- **Endpoint:** `/api/games/{id}`

### Complete Game
- **Method:** `POST`
- **Endpoint:** `/api/games/{id}/complete`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "score": 100,
  "completionTime": 300
}
```
- **Response:**
```json
{
  "message": "تم إكمال اللعبة",
  "pointsEarned": 15
}
```

---

## 👥 Users & Leaderboard

### Get Leaderboard
- **Method:** `GET`
- **Endpoint:** `/api/users/leaderboard`
- **Response:**
```json
[
  {
    "userId": "user-id",
    "userName": "أحمد محمد",
    "points": 250,
    "rank": 1
  }
]
```

### Get User Points
- **Method:** `GET`
- **Endpoint:** `/api/users/{userId}/points`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
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

### Get User Activity
- **Method:** `GET`
- **Endpoint:** `/api/users/{userId}/activity`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "activity": {
    "articlesRead": [
      {
        "articleId": "id",
        "articleTitle": "عنوان",
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

## ⚠️ ملاحظات مهمة

1. **Headers:**
   - جميع الطلبات المحمية تحتاج: `Authorization: Bearer {token}`
   - Content-Type دائماً: `application/json`

2. **Error Responses:**
```json
{
  "message": "رسالة الخطأ",
  "errors": {
    "field": ["خطأ 1", "خطأ 2"]
  }
}
```

3. **Status Codes:**
   - `200`: نجاح
   - `201`: تم الإنشاء
   - `400`: خطأ في البيانات
   - `401`: غير مصرح
   - `404`: غير موجود
   - `500`: خطأ في السيرفر

---

**راجع:** [BACKEND_NOTES.md](./BACKEND_NOTES.md) للتعديلات المطلوبة على Backend
