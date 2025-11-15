'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { User, UserActivity, UserPointsResponse } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Puzzle, Grid3x3, MessageSquare, Video, Trophy } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [activity, setActivity] = useState<UserActivity | null>(null)
  const [points, setPoints] = useState<UserPointsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserActivity()
    fetchUserPoints()
  }, [])

  const fetchUserActivity = async () => {
    try {
      // Note: This endpoint needs to be created in backend
      const response = await apiClient.get<{ activity: UserActivity }>(
        `/api/users/${user?.id}/activity`,
        true
      )
      setActivity(response.activity)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPoints = async () => {
    try {
      const response = await apiClient.get<UserPointsResponse>(
        `/api/users/${user?.id}/points`,
        true
      )
      setPoints(response)
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  const stats = [
    {
      title: t('profile.articlesRead'),
      value: activity?.articlesRead?.length || 0,
      icon: BookOpen,
      color: 'text-blue-500',
      items: activity?.articlesRead || [],
    },
    {
      title: t('profile.puzzlesSolved'),
      value: activity?.puzzlesSolved?.length || 0,
      icon: Puzzle,
      color: 'text-purple-500',
      items: activity?.puzzlesSolved || [],
    },
    {
      title: t('profile.crosswordsSolved'),
      value: activity?.crosswordsSolved?.length || 0,
      icon: Grid3x3,
      color: 'text-green-500',
      items: activity?.crosswordsSolved || [],
    },
    {
      title: t('profile.pollsVoted'),
      value: activity?.pollsVoted?.length || 0,
      icon: MessageSquare,
      color: 'text-orange-500',
      items: activity?.pollsVoted || [],
    },
    {
      title: t('profile.meetingsAttended'),
      value: activity?.meetingsAttended?.length || 0,
      icon: Video,
      color: 'text-red-500',
      items: activity?.meetingsAttended || [],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        <p className="text-muted-foreground">معلوماتك الشخصية وإنجازاتك</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">الاسم</p>
              <p className="text-lg font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              {t('profile.totalPoints')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{user?.points || 0}</div>
            {points && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المقالات</span>
                  <span className="font-medium">{points.breakdown.articles}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الألعاب</span>
                  <span className="font-medium">{points.breakdown.games}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الاستبيانات</span>
                  <span className="font-medium">{points.breakdown.polls}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الجلسات</span>
                  <span className="font-medium">{points.breakdown.discussions}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">{t('profile.activities')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                      <span className="text-3xl font-bold">{stat.value}</span>
                    </div>
                    <CardTitle className="text-lg">{stat.title}</CardTitle>
                  </CardHeader>
                  {stat.items.length > 0 && (
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {stat.items.slice(0, 5).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="text-sm p-2 bg-muted rounded text-right"
                          >
                            <p className="font-medium truncate">
                              {item.articleTitle ||
                                item.gameTitle ||
                                item.pollQuestion ||
                                item.sessionTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                item.completedAt || item.votedAt || item.attendedAt
                              ).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
