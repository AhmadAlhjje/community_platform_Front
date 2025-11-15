'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { LeaderboardEntry } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award } from 'lucide-react'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get<LeaderboardEntry[]>('/api/users/leaderboard')
      setLeaderboard(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-orange-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          {t('common.leaderboard')}
        </h1>
        <p className="text-muted-foreground">أفضل المشاركين في المنصة</p>
      </div>

      <div className="grid gap-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={
                entry.rank <= 3
                  ? 'border-2 border-primary shadow-lg'
                  : ''
              }
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{entry.userName}</h3>
                    <p className="text-sm text-muted-foreground">
                      المرتبة {entry.rank}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary">
                    {entry.points}
                  </p>
                  <p className="text-sm text-muted-foreground">نقطة</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
