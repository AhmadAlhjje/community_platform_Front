"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, Mail, FileText } from "lucide-react";
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

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              سياسة الخصوصية
            </h1>
            <p className="text-lg text-muted-foreground">
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
            </p>
          </motion.div>
        </div>
      </section>

      {/* محتوى السياسة */}
      <section className="py-12 md:py-16">
        <div className="container px-4 max-w-4xl mx-auto space-y-6">

          <SectionCard icon={FileText} title="مقدمة" delay={0.1}>
            <p>
              مرحبًا بك في منصة "صوتنا يبني". نحن نحترم خصوصيتك ونلتزم بحماية
              بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند
              استخدامك لمنصتنا.
            </p>
            <p>
              باستخدامك لمنصتنا، فإنك توافق على جمع واستخدام المعلومات وفقًا لهذه السياسة.
            </p>
          </SectionCard>

          <SectionCard icon={Database} title="المعلومات التي نجمعها" delay={0.2}>
            <p className="font-semibold text-foreground">1. المعلومات التي تقدمها لنا:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>الاسم ورقم الهاتف عند التسجيل</li>
              <li>الرسائل التي ترسلها عبر نموذج الاتصال</li>
            </ul>

            <p className="font-semibold text-foreground mt-4">2. المعلومات التي نجمعها تلقائيًا:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>أوقات الزيارة والصفحات المشاهدة</li>
              <li>بيانات الأداء والاستخدام</li>
              <li>النقاط والإنجازات في الألعاب</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Eye} title="كيفية استخدام المعلومات" delay={0.3}>
            <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>تقديم وتحسين خدمات المنصة</li>
              <li>إدارة حسابك وتخصيص تجربتك</li>
              <li>التواصل معك بشأن المنصة والتحديثات</li>
              <li>ضمان أمان المنصة ومنع الاستخدام غير المشروع</li>
              <li>تحليل الاستخدام لتحسين الخدمات</li>
              <li>الرد على استفساراتك وطلبات الدعم</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Lock} title="حماية المعلومات" delay={0.4}>
            <p>نتخذ إجراءات أمنية صارمة لحماية بياناتك:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>تشفير البيانات أثناء النقل والتخزين</li>
              <li>تخزين كلمات المرور بشكل مشفّر (Hash)</li>
              <li>تقييد الوصول إلى البيانات الشخصية</li>
              <li>مراقبة النظام بشكل مستمر للكشف عن التهديدات</li>
              <li>النسخ الاحتياطي المنتظم للبيانات</li>
            </ul>
            <p className="mt-3">
              ومع ذلك، لا يمكن لأي نظام أن يكون آمنًا بنسبة 100%، لذا نشجعك على اتخاذ
              احتياطاتك الخاصة أيضًا.
            </p>
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="مشاركة المعلومات" delay={0.6}>
            <p className="font-semibold text-foreground">نحن لا نبيع بياناتك الشخصية لأي طرف ثالث.</p>
            <p className="mt-2">قد نشارك المعلومات في الحالات التالية فقط:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>عندما تكون المعلومات عامة بطبيعتها (مثل المقالات والتعليقات العامة)</li>
              <li>مع مزودي الخدمات الذين يساعدوننا في تشغيل المنصة (مثل استضافة الموقع)</li>
              <li>عند وجود التزام قانوني أو أمر قضائي</li>
              <li>لحماية حقوقنا وسلامة مستخدمينا</li>
            </ul>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
