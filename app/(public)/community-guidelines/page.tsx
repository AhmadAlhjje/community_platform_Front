"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { Users, Heart, MessageCircle, ThumbsUp, Shield, AlertTriangle, CheckCircle2, XCircle, Mail, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const GuidelineCard = ({ icon: Icon, title, children, variant = "default", delay }: any) => {
  const variantStyles: Record<string, string> = {
    default: "bg-card border-gray-200 dark:border-gray-800",
    success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="group"
    >
      <div className={`relative ${variantStyles[variant]} border rounded-xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300`}>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
          <div className="text-muted-foreground leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 border-b bg-card/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              قواعد المجتمع
            </h1>
            <p className="text-lg text-muted-foreground">
              معًا نبني مجتمعًا واعيًا، محترمًا، وبنّاءً
            </p>
          </motion.div>
        </div>
      </section>

      {/* محتوى القواعد */}
      <section className="py-12 md:py-16">
        <div className="container px-4 max-w-4xl mx-auto space-y-6">

          <GuidelineCard icon={Heart} title="رسالتنا" delay={0.1}>
            <p>
              منصة "صوتنا يبني" هي مساحة للتعلم والتفاعل والنمو المجتمعي. نؤمن بقوة الحوار
              البنّاء والمشاركة الإيجابية في بناء مجتمع أفضل. قواعدنا مصممة لضمان بيئة آمنة
              ومحترمة للجميع.
            </p>
            <p>
              نحن نرحب بجميع الأفراد الذين يشاركوننا هذه القيم ويلتزمون بالمساهمة في بناء
              مجتمع واعي ومتماسك.
            </p>
          </GuidelineCard>

          <GuidelineCard icon={CheckCircle2} title="القيم الأساسية" variant="success" delay={0.2}>
            <p className="font-semibold text-green-900 dark:text-green-100">نحن نشجع:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><span className="font-semibold">الاحترام المتبادل:</span> معاملة جميع الأعضاء بكرامة واحترام</li>
              <li><span className="font-semibold">الحوار البنّاء:</span> المشاركة في نقاشات هادفة ومثمرة</li>
              <li><span className="font-semibold">التعاون والتضامن:</span> دعم بعضنا البعض في رحلة التعلم والنمو</li>
              <li><span className="font-semibold">التنوع والشمول:</span> احترام وتقدير الاختلافات والتنوع</li>
              <li><span className="font-semibold">المسؤولية المجتمعية:</span> المساهمة الإيجابية في القضايا المجتمعية</li>
            </ul>
          </GuidelineCard>

          <GuidelineCard icon={MessageCircle} title="قواعد التفاعل والمشاركة" delay={0.3}>
            <p className="font-semibold text-foreground">عند المشاركة في المنصة، يُرجى:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>استخدام لغة محترمة ومهذبة في جميع الأوقات</li>
              <li>الاستماع لوجهات النظر المختلفة بعقل منفتح</li>
              <li>التعبير عن آرائك بطريقة بناءة وغير هجومية</li>
              <li>دعم ادعاءاتك بمصادر موثوقة عند الإمكان</li>
              <li>الاعتراف بالأخطاء وتصحيحها عند اكتشافها</li>
              <li>تشجيع الآخرين على المشاركة والتفاعل الإيجابي</li>
              <li>الإبلاغ عن المحتوى المخالف بدلاً من الرد عليه</li>
            </ul>
          </GuidelineCard>

          <GuidelineCard icon={ThumbsUp} title="المواضيع المرحب بها" variant="success" delay={0.4}>
            <p>نشجع المشاركات حول:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  الوعي المجتمعي
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mr-6">
                  <li>القضايا الاجتماعية</li>
                  <li>الصحة العامة</li>
                  <li>السلامة المرورية</li>
                  <li>التوعية الصحية</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  التماسك الاجتماعي
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mr-6">
                  <li>التعاون المجتمعي</li>
                  <li>التضامن الاجتماعي</li>
                  <li>بناء الجسور</li>
                  <li>دعم الفئات المهمشة</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  المواطنة الفاعلة
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mr-6">
                  <li>الحقوق والواجبات</li>
                  <li>المشاركة المدنية</li>
                  <li>الشفافية والمساءلة</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  التطوع والعمل الخيري
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mr-6">
                  <li>فرص التطوع</li>
                  <li>المبادرات الخيرية</li>
                  <li>خدمة المجتمع</li>
                  <li>المشاريع التطوعية</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  الثقافة والتعليم
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mr-6">
                  <li>التراث الثقافي</li>
                  <li>التعليم والتدريب</li>
                  <li>القراءة والكتابة</li>
                  <li>الفنون والأدب</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  البيئة والاستدامة
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 mr-6">
                  <li>حماية البيئة</li>
                  <li>التنمية المستدامة</li>
                  <li>الطاقة المتجددة</li>
                  <li>إعادة التدوير</li>
                </ul>
              </div>
            </div>
          </GuidelineCard>

          <GuidelineCard icon={XCircle} title="السلوكيات المحظورة" variant="danger" delay={0.5}>
            <p className="text-red-600 dark:text-red-400 font-semibold">ممنوع منعًا باتًا:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
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
          </GuidelineCard>

          <GuidelineCard icon={Shield} title="حماية الخصوصية" delay={0.6}>
            <p>احترام خصوصية الآخرين أمر بالغ الأهمية:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>لا تشارك معلومات شخصية عن الآخرين بدون إذنهم</li>
              <li>احذر من مشاركة معلوماتك الشخصية الحساسة</li>
              <li>احترم رغبة الآخرين في الحفاظ على خصوصيتهم</li>
              <li>أبلغ عن أي انتهاكات للخصوصية فورًا</li>
            </ul>
          </GuidelineCard>

          <GuidelineCard icon={AlertTriangle} title="الإبلاغ والإجراءات" variant="warning" delay={0.7}>
            <p className="font-semibold text-amber-900 dark:text-amber-100">إذا رأيت محتوى مخالفًا:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>قدم وصفًا واضحًا للمخالفة</li>
              <li>لا تتفاعل مع المحتوى المخالف بردود سلبية</li>
              <li>دع فريقنا يتعامل مع الموقف</li>
            </ul>

            <p className="font-semibold text-amber-900 dark:text-amber-100 mt-4">الإجراءات التأديبية:</p>
            <p>
              عند مخالفة هذه القواعد، قد نتخذ إجراءات تتراوح من التحذير إلى
              تعليق الحساب أو إغلاقه نهائيًا، حسب خطورة المخالفة وتكرارها.
            </p>
          </GuidelineCard>

          <GuidelineCard icon={Lightbulb} title="نصائح للمشاركة الفعّالة" delay={0.8}>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><span className="font-semibold text-foreground">كن إيجابيًا:</span> ركز على الحلول والمساهمات البناءة</li>
              <li><span className="font-semibold text-foreground">كن واضحًا:</span> عبّر عن أفكارك بوضوح ودقة</li>
              <li><span className="font-semibold text-foreground">كن صبورًا:</span> امنح الآخرين الوقت للرد والتفاعل</li>
              <li><span className="font-semibold text-foreground">كن منفتحًا:</span> استمع لوجهات النظر المختلفة بعقل منفتح</li>
              <li><span className="font-semibold text-foreground">كن داعمًا:</span> شجع الآخرين وقدّر مساهماتهم</li>
            </ul>
          </GuidelineCard>
        </div>
      </section>
    </div>
  );
}
