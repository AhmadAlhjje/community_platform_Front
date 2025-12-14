"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { FileText, CheckCircle, XCircle, AlertCircle, Scale, UserX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const SectionCard = ({ icon: Icon, title, children, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative bg-card border rounded-xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300">
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

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              شروط الاستخدام
            </h1>
            <p className="text-lg text-muted-foreground">
              القواعد والشروط التي تحكم استخدامك لمنصة الوعي المجتمعي
            </p>
          </motion.div>
        </div>
      </section>

      {/* محتوى الشروط */}
      <section className="py-12 md:py-16">
        <div className="container px-4 max-w-4xl mx-auto space-y-6">

          <SectionCard icon={FileText} title="المقدمة والموافقة" delay={0.1}>
            <p>
              مرحبًا بك في منصة "صوتنا يبني". باستخدامك لهذه المنصة، فإنك
              توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه
              الشروط، يرجى عدم استخدام المنصة.
            </p>
            <p>
              نحتفظ بالحق في تحديث هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية.
              استمرارك في استخدام المنصة بعد التغييرات يعني موافقتك على الشروط الجديدة.
            </p>
          </SectionCard>

          <SectionCard icon={CheckCircle} title="أهداف المنصة" delay={0.2}>
            <p>منصتنا تهدف إلى:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>تعزيز الوعي المجتمعي والثقافي</li>
              <li>دعم التماسك الاجتماعي والمواطنة الفاعلة</li>
              <li>نشر المعرفة والقيم الإيجابية</li>
              <li>تشجيع المشاركة المجتمعية البنّاءة</li>
              <li>توفير بيئة تفاعلية آمنة ومحترمة</li>
              <li>تعزيز الحوار الهادف والبناء</li>
            </ul>
          </SectionCard>

          <SectionCard icon={UserX} title="حسابك ومسؤولياتك" delay={0.3}>
            <p className="font-semibold text-foreground">1. إنشاء الحساب:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>يجب تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
              <li>أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك</li>
              <li>أنت مسؤول عن جميع الأنشطة التي تتم من خلال حسابك</li>
              <li>يجب إخطارنا فورًا بأي استخدام غير مصرح به لحسابك</li>
            </ul>

            <p className="font-semibold text-foreground mt-4">2. مسؤوليات المستخدم:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>الالتزام بقواعد المجتمع والسلوك المحترم</li>
              <li>عدم انتحال شخصية الآخرين أو تقديم معلومات مضللة</li>
              <li>عدم استخدام المنصة لأغراض غير قانونية</li>
              <li>احترام حقوق الملكية الفكرية للآخرين</li>
              <li>عدم محاولة اختراق أو تعطيل المنصة</li>
            </ul>
          </SectionCard>

          <SectionCard icon={CheckCircle} title="المحتوى المسموح" delay={0.4}>
            <p>نرحب بالمحتوى الذي يتماشى مع أهداف المنصة، بما في ذلك:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><span className="font-semibold text-foreground">الوعي المجتمعي:</span> موضوعات توعوية عن القضايا الاجتماعية والصحية والبيئية</li>
              <li><span className="font-semibold text-foreground">التماسك الاجتماعي:</span> محتوى يعزز التعاون والتضامن المجتمعي</li>
              <li><span className="font-semibold text-foreground">المواطنة الفاعلة:</span> مواضيع عن الحقوق والواجبات والمشاركة المدنية</li>
              <li><span className="font-semibold text-foreground">التطوع:</span> مبادرات وفرص تطوعية لخدمة المجتمع</li>
              <li><span className="font-semibold text-foreground">الثقافة والتعليم:</span> محتوى ثقافي وتعليمي يثري المعرفة</li>
              <li><span className="font-semibold text-foreground">البيئة والاستدامة:</span> مواضيع حول حماية البيئة والتنمية المستدامة</li>
              <li><span className="font-semibold text-foreground">الحوار البنّاء:</span> نقاشات هادفة ومحترمة حول القضايا المجتمعية</li>
            </ul>
          </SectionCard>

          <SectionCard icon={XCircle} title="المحتوى المحظور" delay={0.5}>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><span className="font-semibold text-foreground">السياسة الحزبية:</span> الدعاية أو الترويج لأحزاب سياسية معينة</li>
              <li><span className="font-semibold text-foreground">الطائفية:</span> أي محتوى يحرض على الانقسام الطائفي أو المذهبي</li>
              <li><span className="font-semibold text-foreground">العنصرية والتمييز:</span> المحتوى الذي يميز ضد أي مجموعة بناءً على العرق أو الجنس أو الدين أو غيرها</li>
              <li><span className="font-semibold text-foreground">الكراهية والعنف:</span> خطاب الكراهية أو التحريض على العنف</li>
              <li><span className="font-semibold text-foreground">المعلومات المضللة:</span> الأخبار الكاذبة أو المعلومات المضللة المتعمدة</li>
              <li><span className="font-semibold text-foreground">المحتوى التجاري:</span> الإعلانات أو الترويج التجاري غير المصرح به</li>
              <li><span className="font-semibold text-foreground">الانتهاكات القانونية:</span> أي محتوى يخالف القوانين المحلية أو الدولية</li>
              <li><span className="font-semibold text-foreground">البريد العشوائي:</span> الرسائل المزعجة أو المتكررة بشكل مفرط</li>
              <li><span className="font-semibold text-foreground">التحرش والمضايقة:</span> أي سلوك يهدف إلى إزعاج أو تهديد الآخرين</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Scale} title="حقوق الملكية الفكرية" delay={0.6}>
            <p className="font-semibold text-foreground">1. محتوى المنصة:</p>
            <p>
              جميع المحتويات المتاحة على المنصة (النصوص، الصور، الشعارات، التصميمات، الألعاب)
              محمية بحقوق الطبع والنشر وهي ملك للمنصة أو مرخصة لها. لا يجوز نسخها أو توزيعها
              أو تعديلها دون إذن كتابي مسبق.
            </p>
          </SectionCard>

          <SectionCard icon={AlertCircle} title="إجراءات الإنفاذ" delay={0.7}>
            <p>
              في حالة مخالفة هذه الشروط أو قواعد المجتمع، قد نتخذ الإجراءات التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><span className="font-semibold text-foreground">تحذير:</span> إرسال تحذير للمستخدم بشأن المخالفة</li>
              <li><span className="font-semibold text-foreground">تقييد الحساب:</span> تعطيل بعض ميزات الحساب مؤقتًا</li>
              <li><span className="font-semibold text-foreground">تعليق الحساب:</span> تعليق الحساب لفترة محددة</li>
              <li><span className="font-semibold text-foreground">إغلاق الحساب:</span> إغلاق الحساب نهائيًا في حالات المخالفات الجسيمة أو المتكررة</li>
              <li><span className="font-semibold text-foreground">الإبلاغ القانوني:</span> إبلاغ السلطات المختصة في حالات المخالفات القانونية</li>
            </ul>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
