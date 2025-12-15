"use client";

import { PublicNavbar } from "@/components/public-navbar";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            قواعد المجتمع
          </h1>
          <p className="text-lg text-gray-600">
            معًا نبني مجتمعًا واعيًا، محترمًا، وبنّاءً
          </p>
        </div>

        {/* المحتوى */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h2>
            <p>
              منصة "صوتنا يبني" هي مساحة للتعلم والتفاعل والنمو المجتمعي. نؤمن بقوة الحوار
              البنّاء والمشاركة الإيجابية في بناء مجتمع أفضل. قواعدنا مصممة لضمان بيئة آمنة
              ومحترمة للجميع.
            </p>
            <p>
              نحن نرحب بجميع الأفراد الذين يشاركوننا هذه القيم ويلتزمون بالمساهمة في بناء
              مجتمع واعي ومتماسك.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">القيم الأساسية</h2>
            <p className="mb-3 font-semibold">نحن نشجع:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><span className="font-semibold">الاحترام المتبادل:</span> معاملة جميع الأعضاء بكرامة واحترام</li>
              <li><span className="font-semibold">الحوار البنّاء:</span> المشاركة في نقاشات هادفة ومثمرة</li>
              <li><span className="font-semibold">التعاون والتضامن:</span> دعم بعضنا البعض في رحلة التعلم والنمو</li>
              <li><span className="font-semibold">التنوع والشمول:</span> احترام وتقدير الاختلافات والتنوع</li>
              <li><span className="font-semibold">المسؤولية المجتمعية:</span> المساهمة الإيجابية في القضايا المجتمعية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">قواعد التفاعل والمشاركة</h2>
            <p className="mb-3 font-semibold">عند المشاركة في المنصة، يُرجى:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>استخدام لغة محترمة ومهذبة في جميع الأوقات</li>
              <li>الاستماع لوجهات النظر المختلفة بعقل منفتح</li>
              <li>التعبير عن آرائك بطريقة بناءة وغير هجومية</li>
              <li>دعم ادعاءاتك بمصادر موثوقة عند الإمكان</li>
              <li>الاعتراف بالأخطاء وتصحيحها عند اكتشافها</li>
              <li>تشجيع الآخرين على المشاركة والتفاعل الإيجابي</li>
              <li>الإبلاغ عن المحتوى المخالف بدلاً من الرد عليه</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المواضيع المرحب بها</h2>
            <p className="mb-4">نشجع المشاركات حول:</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الوعي المجتمعي</h3>
                <ul className="list-disc list-inside space-y-1 mr-6 text-gray-700">
                  <li>القضايا الاجتماعية</li>
                  <li>الصحة العامة</li>
                  <li>السلامة المرورية</li>
                  <li>التوعية الصحية</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">التماسك الاجتماعي</h3>
                <ul className="list-disc list-inside space-y-1 mr-6 text-gray-700">
                  <li>التعاون المجتمعي</li>
                  <li>التضامن الاجتماعي</li>
                  <li>بناء الجسور</li>
                  <li>دعم الفئات المهمشة</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">المواطنة الفاعلة</h3>
                <ul className="list-disc list-inside space-y-1 mr-6 text-gray-700">
                  <li>الحقوق والواجبات</li>
                  <li>المشاركة المدنية</li>
                  <li>الشفافية والمساءلة</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">التطوع والعمل الخيري</h3>
                <ul className="list-disc list-inside space-y-1 mr-6 text-gray-700">
                  <li>فرص التطوع</li>
                  <li>المبادرات الخيرية</li>
                  <li>خدمة المجتمع</li>
                  <li>المشاريع التطوعية</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الثقافة والتعليم</h3>
                <ul className="list-disc list-inside space-y-1 mr-6 text-gray-700">
                  <li>التراث الثقافي</li>
                  <li>التعليم والتدريب</li>
                  <li>القراءة والكتابة</li>
                  <li>الفنون والأدب</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">البيئة والاستدامة</h3>
                <ul className="list-disc list-inside space-y-1 mr-6 text-gray-700">
                  <li>حماية البيئة</li>
                  <li>التنمية المستدامة</li>
                  <li>الطاقة المتجددة</li>
                  <li>إعادة التدوير</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">السلوكيات المحظورة</h2>
            <p className="mb-3 font-semibold text-red-600">ممنوع منعًا باتًا:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><span className="font-semibold">خطاب الكراهية:</span> أي محتوى يحرض على الكراهية أو العنف ضد أي مجموعة</li>
              <li><span className="font-semibold">التنمر والتحرش:</span> مضايقة أو تهديد أو ترهيب الآخرين</li>
              <li><span className="font-semibold">التمييز:</span> التمييز على أساس العرق أو الجنس أو الدين أو الأصل أو الإعاقة</li>
              <li><span className="font-semibold">الطائفية:</span> التحريض على الانقسام الطائفي أو المذهبي</li>
              <li><span className="font-semibold">السياسة الحزبية:</span> الترويج أو الدعاية لأحزاب سياسية معينة</li>
              <li><span className="font-semibold">المعلومات المضللة:</span> نشر أخبار كاذبة أو معلومات مضللة متعمدة</li>
              <li><span className="font-semibold">البريد العشوائي:</span> إرسال رسائل مزعجة أو متكررة</li>
              <li><span className="font-semibold">الانتحال:</span> انتحال شخصية الآخرين أو تقديم معلومات مضللة عن الهوية</li>
              <li><span className="font-semibold">المحتوى غير اللائق:</span> نشر محتوى إباحي أو عنيف أو مسيء</li>
              <li><span className="font-semibold">الإعلانات غير المصرح بها:</span> الترويج التجاري بدون إذن</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حماية الخصوصية</h2>
            <p className="mb-3">احترام خصوصية الآخرين أمر بالغ الأهمية:</p>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>لا تشارك معلومات شخصية عن الآخرين بدون إذنهم</li>
              <li>احذر من مشاركة معلوماتك الشخصية الحساسة</li>
              <li>احترم رغبة الآخرين في الحفاظ على خصوصيتهم</li>
              <li>أبلغ عن أي انتهاكات للخصوصية فورًا</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">الإبلاغ والإجراءات</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">إذا رأيت محتوى مخالفًا:</h3>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li>قدم وصفًا واضحًا للمخالفة</li>
              <li>لا تتفاعل مع المحتوى المخالف بردود سلبية</li>
              <li>دع فريقنا يتعامل مع الموقف</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">الإجراءات التأديبية:</h3>
            <p>
              عند مخالفة هذه القواعد، قد نتخذ إجراءات تتراوح من التحذير إلى
              تعليق الحساب أو إغلاقه نهائيًا، حسب خطورة المخالفة وتكرارها.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">نصائح للمشاركة الفعّالة</h2>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><span className="font-semibold">كن إيجابيًا:</span> ركز على الحلول والمساهمات البناءة</li>
              <li><span className="font-semibold">كن واضحًا:</span> عبّر عن أفكارك بوضوح ودقة</li>
              <li><span className="font-semibold">كن صبورًا:</span> امنح الآخرين الوقت للرد والتفاعل</li>
              <li><span className="font-semibold">كن منفتحًا:</span> استمع لوجهات النظر المختلفة بعقل منفتح</li>
              <li><span className="font-semibold">كن داعمًا:</span> شجع الآخرين وقدّر مساهماتهم</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
