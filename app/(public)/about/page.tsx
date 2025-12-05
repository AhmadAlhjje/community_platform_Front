"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/public-navbar";
import { Users, Target, Lightbulb, Heart, Zap, ArrowRight } from "lucide-react";

const TeamMember = ({ name, role, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative bg-card border rounded-xl p-6 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-3">
        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-primary font-medium">{role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const ValueCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative bg-gradient-to-br from-card to-card/50 border rounded-xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-3">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Target,
      title: "رؤيتنا",
      description:
        "بناء مجتمع واعي ومتطور من خلال التكنولوجيا والتعليم التفاعلي",
    },
    {
      icon: Lightbulb,
      title: "الابتكار",
      description: "نستخدم أحدث التقنيات لإنشاء تجارب تعليمية فريدة وممتعة",
    },
    {
      icon: Heart,
      title: "الشغف",
      description: "نؤمن بقوة التعليم والتطور الشخصي والمجتمعي",
    },
    {
      icon: Zap,
      title: "الجودة",
      description: "نسعى لتقديم أفضل جودة في المحتوى والخدمات",
    },
  ];

  const team = [
    {
      name: "فريق التطوير",
      role: "Backend & Frontend",
      description:
        "متخصصون في بناء تطبيقات ويب قوية وموثوقة باستخدام أحدث التقنيات",
    },
    {
      name: "فريق التصميم",
      role: "UI/UX Design",
      description: "متخصصون في تصميم واجهات مستخدم جميلة وسهلة الاستخدام",
    },
    {
      name: "فريق المحتوى",
      role: "Content Creation",
      description: "متخصصون في إنشاء محتوى توعوي قيّم وممتع للمستخدمين",
    },
    {
      name: "فريق الجودة",
      role: "QA & Testing",
      description: "متخصصون في اختبار وضمان جودة المنصة والخدمات",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="container relative px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              من نحن وماذا نفعل
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              منصة صوتنا يبني هي مبادرة تعليمية تهدف إلى نشر المعرفة والتوعية
              المجتمعية من خلال أدوات تفاعلية حديثة وممتعة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg">
                  تواصل معنا
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              قيمنا
            </h2>
            <p className="text-lg text-muted-foreground">
              ما يحرك عملنا ويوجه قراراتنا
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 border-t bg-card/50">
        <div className="container px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  قصتنا
                </h2>
              </div>

              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  بدأت منصّتُنا كفكرة بسيطة: كيف يمكننا جعل التوعية أكثر تأثيرًا
                  وقربًا من الناس؟ أدركنا أن الأساليب التقليدية وحدها قد لا تكون
                  كافية في عصر تتسارع فيه التحديات.
                </p>

                <p>
                  لذلك، قررنا بناء منصة تجمع بين المعرفة والتفاعل والانخراط
                  المجتمعي، حيث يمكن للمستخدمين التعرّف على القيم والحقوق
                  والواجبات بأسلوب مبسّط ومُلهم، مع تشجيع المشاركة الفعّالة
                  وتعزيز الإحساس بالمسؤولية.
                </p>

                <p>
                  اليوم، نفخر بأننا نساهم في نشر الوعي وتعزيز المواطنة وبناء
                  مجتمع متماسك، وندعوك لأن تكون جزءًا من هذه الرحلة نحو مستقبل
                  أفضل لنا جميعًا.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              فريقنا
            </h2>
            <p className="text-lg text-muted-foreground">
              مجموعة من المتخصصين المحترفين الملتزمين برؤيتنا
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 منصة صوتنا يبني. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
