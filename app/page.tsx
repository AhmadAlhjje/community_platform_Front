"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/public-navbar";
import { ActivePollsTicker } from "@/components/active-polls-ticker";
import {
  BookOpen,
  Gamepad2,
  MessageSquare,
  Trophy,
  Sparkles,
  ArrowRight,
  Users,
  Heart,
  Handshake,
} from "lucide-react";
import Image from "next/image";

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative h-full bg-card border rounded-xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50">
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

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const features = [
    {
      icon: BookOpen,
      title: t("articles.title"),
      description:
        "اقرأ مقالات توعوية واختبر معلوماتك من خلال الأسئلة التفاعلية",
    },
    {
      icon: Gamepad2,
      title: t("games.title"),
      description: "العب ألعاب توعوية ممتعة وتعلم بطريقة تفاعلية وحقق نقاطاً",
    },
    {
      icon: MessageSquare,
      title: t("polls.title"),
      description:
        "شارك آراءك في الاستبيانات المجتمعية وشارك في الحوارات البناءة",
    },
    {
      icon: Trophy,
      title: t("common.leaderboard"),
      description: "تنافس مع المستخدمين الآخرين وصعد إلى قمة لوحة الصدارة",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Active Polls Ticker */}
      <ActivePollsTicker />

      {/* Hero Section */}
      <section
        className="relative py-12 md:py-20 border-b"
        style={{
          backgroundImage: 'url(/images/hero-community.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="container relative px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  <span className="text-white drop-shadow-lg">منصة </span>
                  <span className="text-primary drop-shadow-lg">
                    صوتنا يبني
                  </span>
                </h1>

                <p className="text-lg text-white/95 mb-8 leading-relaxed drop-shadow-md">
                  شارك بطريقة تفاعلية وممتعة من خلال المقالات والألعاب التعليمية
                  والاستبيانات المجتمعية. احصل على نقاط وتنافس مع المستخدمين
                  الآخرين.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto group">
                      إنشاء حساب جديد
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </motion.div>
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      دخول
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              صوتنا في خدمة الوطن
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              معاً نبني مجتمع واعي ومتماسك من خلال مشاركة الشباب الفعّالة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/OIP1.webp"
                  alt="مشاركة الشباب"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">
                      مشاركة الشباب
                    </h3>
                  </div>
                  <p className="text-sm text-white/90">
                    صوت كل شاب له تأثير في بناء المجتمع
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/OIP2.jpeg"
                  alt="التماسك المجتمعي"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Handshake className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">
                      التماسك المجتمعي
                    </h3>
                  </div>
                  <p className="text-sm text-white/90">
                    نبني مستقبلنا معاً بالتعاون والتكاتف
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/hero-community.webp"
                  alt="حب الوطن"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">حب الوطن</h3>
                  </div>
                  <p className="text-sm text-white/90">
                    بالعمل والإنجاز نعبّر عن حبنا لوطننا
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              المميزات الرئيسية
            </h2>
            <p className="text-lg text-muted-foreground">
              منصة شاملة توفر لك وعي بطريقة مبتكرة
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="py-16 md:py-24 border-t bg-card/20">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/hero-community.webp"
                  alt="نظرة عامة على المنصة"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                منصة تفاعلية لبناء الوعي
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                صوتنا يبني هي منصة رقمية مبتكرة تهدف إلى تعزيز الوعي المجتمعي من
                خلال المحتوى التفاعلي والمشاركة الفعّالة. نوفر لك الأدوات
                اللازمة للتعلم والتطور والمساهمة في بناء مجتمع أفضل.
              </p>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">تعلم بطريقة ممتعة</h3>
                    <p className="text-sm text-muted-foreground">
                      مقالات وألعاب تفاعلية تجعل التعلم تجربة ممتعة
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">شارك رأيك</h3>
                    <p className="text-sm text-muted-foreground">
                      ساهم في الاستبيانات وشارك أفكارك مع المجتمع
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">تنافس وتطور</h3>
                    <p className="text-sm text-muted-foreground">
                      احصل على نقاط وتنافس مع الآخرين في لوحة الصدارة
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 md:py-16 bg-muted/30 border-y">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              شركاؤنا في النجاح
            </h2>
            <p className="text-muted-foreground">
              نفخر بدعم وثقة شركائنا الاستراتيجيين
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {[1, 2].map((num, index) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="relative w-32 h-32 md:w-40 md:h-40 bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`/images/partners/partner-${num}.png`}
                    alt={`شريك ${num}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-16 md:py-24 border-t"
        style={{
          backgroundImage: 'url(/images/OIP1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="container relative px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              ابدأ رحلة الوعي الآن
            </h2>
            <p className="text-lg text-white/95 drop-shadow-md">
              انضم إلى المستخدمين الذين يتعلمون ويتطورون على منصتنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="group">
                  إنشاء حساب
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.div>
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  لديّ حساب بالفعل
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
