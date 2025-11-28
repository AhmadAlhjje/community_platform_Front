'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Gamepad2, MessageSquare, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const activities = [
    {
      title: t('articles.title'),
      description: 'اقرأ المقالات وأجب على الاختبارات',
      icon: BookOpen,
      href: '/articles',
      color: 'text-blue-500',
    },
    {
      title: t('games.title'),
      description: 'العب الألعاب التفاعلية',
      icon: Gamepad2,
      href: '/games',
      color: 'text-green-500',
    },
    {
      title: t('polls.title'),
      description: 'شارك في الاستبيانات والجلسات',
      icon: MessageSquare,
      href: '/polls',
      color: 'text-purple-500',
    },
    {
      title: t('common.leaderboard'),
      description: 'شاهد لوحة الصدارة',
      icon: Trophy,
      href: '/leaderboard',
      color: 'text-yellow-500',
    },
  ]

  return (
    <div className="w-full min-h-screen space-y-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-foreground">مرحباً، {user?.name}!</h1>
      </div>

      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={activity.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Icon className={`h-8 w-8 ${activity.color} mb-2`} />
                    <CardTitle>{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
