'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { UserDetailsResponse, UserPointsResponse } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User as UserIcon, Mail, Trophy, Award, TrendingUp, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [userDetails, setUserDetails] = useState<UserDetailsResponse['data'] | null>(null)
  const [userPoints, setUserPoints] = useState<UserPointsResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchUserData()
    }
  }, [user?.id])

  const fetchUserData = async () => {
    try {
      // Fetch user details
      const detailsResponse = await apiClient.get<UserDetailsResponse>(
        `/api/users/${user?.id}`,
        true
      )
      setUserDetails(detailsResponse.data)

      // Fetch user points
      const pointsResponse = await apiClient.get<UserPointsResponse>(
        `/api/users/${user?.id}/points`,
        true
      )
      setUserPoints(pointsResponse.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
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
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">الملف الشخصي</h1>
                <p className="text-muted-foreground">معلوماتك الشخصية وإنجازاتك</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-medium">{userDetails?.name || user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{userDetails?.email || user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">عضو منذ</p>
                  <p className="font-medium">
                    {userDetails?.createdAt
                      ? new Date(userDetails.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Points & Rank */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                النقاط والترتيب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Points */}
              <div className="text-center p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">إجمالي النقاط</p>
                </div>
                <p className="text-5xl font-bold text-primary">
                  {userPoints?.points || userDetails?.points || 0}
                </p>
              </div>

              {/* Rank */}
              {userPoints?.rank && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">ترتيبك</p>
                  </div>
                  <p className="text-3xl font-bold">#{userPoints.rank}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
