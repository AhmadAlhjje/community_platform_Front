'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { LeaderboardEntry } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Medal, Award, User } from 'lucide-react'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: LeaderboardEntry[] }>('/api/users/leaderboard')
      setLeaderboard(response.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'border-2 border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20'
    if (rank === 2) return 'border-2 border-gray-400/50 bg-gray-50/50 dark:bg-gray-950/20'
    if (rank === 3) return 'border-2 border-amber-600/50 bg-amber-50/50 dark:bg-amber-950/20'
    return ''
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">لوحة الصدارة</h1>
                <p className="text-muted-foreground">أفضل المشاركين في المنصة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leaderboard List */}
      <div className="grid gap-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={getRankStyle(entry.rank)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Rank & User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 flex justify-center items-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-muted rounded-full p-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{entry.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          عضو منذ {new Date(entry.memberSince).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {entry.points}
                    </p>
                    <p className="text-sm text-muted-foreground">نقطة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {leaderboard.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد بيانات</h3>
          <p className="text-muted-foreground">لم يتم العثور على مشاركين بعد</p>
        </motion.div>
      )}
    </div>
  )
}
