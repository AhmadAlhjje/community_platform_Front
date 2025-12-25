'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivePollsTicker } from '@/components/active-polls-ticker'
import { BookOpen, Gamepad2, MessageSquare, Trophy, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const ActivityCard = ({ activity, index }: any) => {
  const Icon = activity.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <Link href={activity.href}>
        <Card className="h-full relative overflow-hidden group hover:shadow-2xl hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col">
          {/* صورة الخلفية */}
          <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-background/60 group-hover:from-primary/5 group-hover:via-background/40 group-hover:to-background/50 transition-colors duration-300" />

          <CardHeader className="relative">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg mb-4"
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl text-foreground font-bold mb-2 drop-shadow-sm">{activity.title}</CardTitle>
            <CardDescription className="text-base mt-2 leading-relaxed text-foreground/90 font-medium drop-shadow-sm">{activity.description}</CardDescription>
          </CardHeader>

          <CardContent className="relative mt-auto">
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="flex items-center text-base font-bold text-primary group-hover:text-primary/80 transition-colors"
            >
              <span>ابدأ الآن</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const activities = [
    {
      title: t('articles.title'),
      description: 'اقرأ مقالات توعوية واختبر معلوماتك',
      icon: BookOpen,
      href: '/articles',
      image: '/images/مقالات.jpg',
    },
    {
      title: t('games.title'),
      description: 'العب ألعاب تفاعلية وحقق نقاطاً',
      icon: Gamepad2,
      href: '/games',
      image: '/images/العاب.jpg',
    },
    {
      title: t('polls.title'),
      description: 'شارك في الاستبيانات المجتمعية',
      icon: MessageSquare,
      href: '/polls',
      image: '/images/استبيان.jpg',
    },
    {
      title: t('common.leaderboard'),
      description: 'شاهد لوحة الصدارة والترتيبات',
      icon: Trophy,
      href: '/leaderboard',
      image: '/images/لوحة صدارة.jpg',
    },
  ]

  return (
    <div className="w-full min-h-screen space-y-8">
      {/* Active Polls Ticker */}
      <ActivePollsTicker />

      {/* Hero Section مع خلفية */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-8 md:p-12"
        style={{
          backgroundImage: 'url(/images/hero-community.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/55 to-background/60" />

        <div className="relative space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 rounded-full border-2 border-foreground/20 shadow-lg backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5 text-foreground drop-shadow-md" />
            <span className="text-foreground font-bold drop-shadow-md">مرحباً بك في منصتك!</span>
          </motion.div>

          <h1 className="text-primary text-4xl md:text-5xl font-bold">
            أهلاً، <span className="text-foreground font-bold drop-shadow-md">{user?.name}!</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            اختر من المميزات أدناه لبدء رحلتك التعليمية والتفاعلية
          </p>
        </div>
      </motion.div>

      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {activities.map((activity, index) => (
          <ActivityCard key={activity.href} activity={activity} index={index} />
        ))}
      </div>
    </div>
  )
}
