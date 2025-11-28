'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Gamepad2, MessageSquare, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ActivityCard = ({ activity, index }: any) => {
  const Icon = activity.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link href={activity.href}>
        <Card className="h-full relative overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader className="relative">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground">{activity.title}</CardTitle>
            <CardDescription className="text-base mt-2">{activity.description}</CardDescription>
          </CardHeader>

          <CardContent className="relative mt-auto">
            <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              اذهب الآن
              <ArrowRight className="h-4 w-4 mr-2" />
            </div>
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
      description: 'اقرأ مقالات تعليمية واختبر معلوماتك',
      icon: BookOpen,
      href: '/articles',
    },
    {
      title: t('games.title'),
      description: 'العب ألعاب تفاعلية وحقق نقاطاً',
      icon: Gamepad2,
      href: '/games',
    },
    {
      title: t('polls.title'),
      description: 'شارك في الاستبيانات المجتمعية',
      icon: MessageSquare,
      href: '/polls',
    },
    {
      title: t('common.leaderboard'),
      description: 'شاهد لوحة الصدارة والترتيبات',
      icon: Trophy,
      href: '/leaderboard',
    },
  ]

  return (
    <div className="w-full min-h-screen space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">
          مرحباً بك، <span className="text-primary">{user?.name}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">
          اختر من المميزات أدناه لبدء رحلتك التعليمية
        </p>
      </motion.div>

      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {activities.map((activity, index) => (
          <ActivityCard key={activity.href} activity={activity} index={index} />
        ))}
      </div>
    </div>
  )
}
