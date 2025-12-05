'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { PublicNavbar } from '@/components/public-navbar'
import { BookOpen, Gamepad2, MessageSquare, Trophy, Sparkles, ArrowRight } from 'lucide-react'

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
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
)

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const features = [
    {
      icon: BookOpen,
      title: t('articles.title'),
      description: 'اقرأ مقالات توعوية واختبر معلوماتك من خلال الأسئلة التفاعلية',
    },
    {
      icon: Gamepad2,
      title: t('games.title'),
      description: 'العب ألعاب توعوية ممتعة وتعلم بطريقة تفاعلية وحقق نقاطاً',
    },
    {
      icon: MessageSquare,
      title: t('polls.title'),
      description: 'شارك آراءك في الاستبيانات المجتمعية وشارك في الحوارات البناءة',
    },
    {
      icon: Trophy,
      title: t('common.leaderboard'),
      description: 'تنافس مع المستخدمين الآخرين وصعد إلى قمة لوحة الصدارة',
    },
  ]

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

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span className="text-foreground">منصة </span>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
               صوتنا يبني
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              شارك بطريقة تفاعلية وممتعة من خلال المقالات والألعاب التعليمية والاستبيانات المجتمعية. احصل على نقاط وتنافس مع المستخدمين الآخرين.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  إنشاء حساب جديد
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  دخول
                </Button>
              </Link>
            </div>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">المميزات الرئيسية</h2>
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">ابدأ رحلة الوعي الآن</h2>
            <p className="text-lg text-muted-foreground">
              انضم إلى المستخدمين الذين يتعلمون ويتطورون على منصتنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg">
                  إنشاء حساب
                  <ArrowRight className="h-4 w-4 ml-2" />
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

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 منصة صوتنا يبني. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
