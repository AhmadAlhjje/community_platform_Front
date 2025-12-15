"use client";

import { PublicNavbar } from "@/components/public-navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            شروط الاستخدام
          </h1>
          <p className="text-lg text-gray-600">
            القواعد والشروط التي تحكم استخدامك لمنصة الوعي المجتمعي
          </p>
        </div>

        {/* المحتوى */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المقدمة والموافقة</h2>
            <p>
              مرحبًا بك في منصة "صوتنا يبني". باستخدامك لهذه المنصة، فإنك
              توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه
              الشروط، يرجى عدم استخدام المنصة.
            </p>
            <p>
              نحتفظ بالحق في تحديث هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية.
              استمرارك في استخدام المنصة بعد التغييرات يعني موافقتك على الشروط الجديدة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">أهداف المنصة</h2>
            <p className="mb-3">منصتنا تهدف إلى:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>تعزيز الوعي المجتمعي والثقافي</li>
              <li>دعم التماسك الاجتماعي والمواطنة الفاعلة</li>
              <li>نشر المعرفة والقيم الإيجابية</li>
              <li>تشجيع المشاركة المجتمعية البنّاءة</li>
              <li>توفير بيئة تفاعلية آمنة ومحترمة</li>
              <li>تعزيز الحوار الهادف والبناء</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حسابك ومسؤولياتك</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. إنشاء الحساب:</h3>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>يجب تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
              <li>أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك</li>
              <li>أنت مسؤول عن جميع الأنشطة التي تتم من خلال حسابك</li>
              <li>يجب إخطارنا فورًا بأي استخدام غير مصرح به لحسابك</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. مسؤوليات المستخدم:</h3>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>الالتزام بقواعد المجتمع والسلوك المحترم</li>
              <li>عدم انتحال شخصية الآخرين أو تقديم معلومات مضللة</li>
              <li>عدم استخدام المنصة لأغراض غير قانونية</li>
              <li>احترام حقوق الملكية الفكرية للآخرين</li>
              <li>عدم محاولة اختراق أو تعطيل المنصة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المحتوى المسموح</h2>
            <p className="mb-3">نرحب بالمحتوى الذي يتماشى مع أهداف المنصة، بما في ذلك:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><span className="font-semibold">الوعي المجتمعي:</span> موضوعات توعوية عن القضايا الاجتماعية والصحية والبيئية</li>
              <li><span className="font-semibold">التماسك الاجتماعي:</span> محتوى يعزز التعاون والتضامن المجتمعي</li>
              <li><span className="font-semibold">المواطنة الفاعلة:</span> مواضيع عن الحقوق والواجبات والمشاركة المدنية</li>
              <li><span className="font-semibold">التطوع:</span> مبادرات وفرص تطوعية لخدمة المجتمع</li>
              <li><span className="font-semibold">الثقافة والتعليم:</span> محتوى ثقافي وتعليمي يثري المعرفة</li>
              <li><span className="font-semibold">البيئة والاستدامة:</span> مواضيع حول حماية البيئة والتنمية المستدامة</li>
              <li><span className="font-semibold">الحوار البنّاء:</span> نقاشات هادفة ومحترمة حول القضايا المجتمعية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المحتوى المحظور</h2>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><span className="font-semibold">السياسة الحزبية:</span> الدعاية أو الترويج لأحزاب سياسية معينة</li>
              <li><span className="font-semibold">الطائفية:</span> أي محتوى يحرض على الانقسام الطائفي أو المذهبي</li>
              <li><span className="font-semibold">العنصرية والتمييز:</span> المحتوى الذي يميز ضد أي مجموعة بناءً على العرق أو الجنس أو الدين أو غيرها</li>
              <li><span className="font-semibold">الكراهية والعنف:</span> خطاب الكراهية أو التحريض على العنف</li>
              <li><span className="font-semibold">المعلومات المضللة:</span> الأخبار الكاذبة أو المعلومات المضللة المتعمدة</li>
              <li><span className="font-semibold">المحتوى التجاري:</span> الإعلانات أو الترويج التجاري غير المصرح به</li>
              <li><span className="font-semibold">الانتهاكات القانونية:</span> أي محتوى يخالف القوانين المحلية أو الدولية</li>
              <li><span className="font-semibold">البريد العشوائي:</span> الرسائل المزعجة أو المتكررة بشكل مفرط</li>
              <li><span className="font-semibold">التحرش والمضايقة:</span> أي سلوك يهدف إلى إزعاج أو تهديد الآخرين</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حقوق الملكية الفكرية</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. محتوى المنصة:</h3>
            <p>
              جميع المحتويات المتاحة على المنصة (النصوص، الصور، الشعارات، التصميمات، الألعاب)
              محمية بحقوق الطبع والنشر وهي ملك للمنصة أو مرخصة لها. لا يجوز نسخها أو توزيعها
              أو تعديلها دون إذن كتابي مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">إجراءات الإنفاذ</h2>
            <p className="mb-3">
              في حالة مخالفة هذه الشروط أو قواعد المجتمع، قد نتخذ الإجراءات التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><span className="font-semibold">تحذير:</span> إرسال تحذير للمستخدم بشأن المخالفة</li>
              <li><span className="font-semibold">تقييد الحساب:</span> تعطيل بعض ميزات الحساب مؤقتًا</li>
              <li><span className="font-semibold">تعليق الحساب:</span> تعليق الحساب لفترة محددة</li>
              <li><span className="font-semibold">إغلاق الحساب:</span> إغلاق الحساب نهائيًا في حالات المخالفات الجسيمة أو المتكررة</li>
              <li><span className="font-semibold">الإبلاغ القانوني:</span> إبلاغ السلطات المختصة في حالات المخالفات القانونية</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
