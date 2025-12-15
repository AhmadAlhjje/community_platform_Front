"use client";

import { PublicNavbar } from "@/components/public-navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-lg text-gray-600">
            نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
          </p>
        </div>

        {/* المحتوى */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مقدمة</h2>
            <p>
              مرحبًا بك في منصة "صوتنا يبني". نحن نحترم خصوصيتك ونلتزم بحماية
              بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند
              استخدامك لمنصتنا.
            </p>
            <p>
              باستخدامك لمنصتنا، فإنك توافق على جمع واستخدام المعلومات وفقًا لهذه السياسة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المعلومات التي نجمعها</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. المعلومات التي تقدمها لنا:</h3>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>الاسم ورقم الهاتف عند التسجيل</li>
              <li>الرسائل التي ترسلها عبر نموذج الاتصال</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. المعلومات التي نجمعها تلقائيًا:</h3>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>أوقات الزيارة والصفحات المشاهدة</li>
              <li>بيانات الأداء والاستخدام</li>
              <li>النقاط والإنجازات في الألعاب</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">كيفية استخدام المعلومات</h2>
            <p className="mb-3">نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>تقديم وتحسين خدمات المنصة</li>
              <li>إدارة حسابك وتخصيص تجربتك</li>
              <li>التواصل معك بشأن المنصة والتحديثات</li>
              <li>ضمان أمان المنصة ومنع الاستخدام غير المشروع</li>
              <li>تحليل الاستخدام لتحسين الخدمات</li>
              <li>الرد على استفساراتك وطلبات الدعم</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حماية المعلومات</h2>
            <p className="mb-3">نتخذ إجراءات أمنية صارمة لحماية بياناتك:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>تشفير البيانات أثناء النقل والتخزين</li>
              <li>تخزين كلمات المرور بشكل مشفّر (Hash)</li>
              <li>تقييد الوصول إلى البيانات الشخصية</li>
              <li>مراقبة النظام بشكل مستمر للكشف عن التهديدات</li>
              <li>النسخ الاحتياطي المنتظم للبيانات</li>
            </ul>
            <p className="mt-4">
              ومع ذلك، لا يمكن لأي نظام أن يكون آمنًا بنسبة 100%، لذا نشجعك على اتخاذ
              احتياطاتك الخاصة أيضًا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مشاركة المعلومات</h2>
            <p className="font-semibold mb-2">نحن لا نبيع بياناتك الشخصية لأي طرف ثالث.</p>
            <p className="mb-3">قد نشارك المعلومات في الحالات التالية فقط:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>عندما تكون المعلومات عامة بطبيعتها (مثل المقالات والتعليقات العامة)</li>
              <li>مع مزودي الخدمات الذين يساعدوننا في تشغيل المنصة (مثل استضافة الموقع)</li>
              <li>عند وجود التزام قانوني أو أمر قضائي</li>
              <li>لحماية حقوقنا وسلامة مستخدمينا</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
