'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart3, Users, Calendar, Award, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/hooks/use-toast'

interface PollOption {
  id: string
  text: string
  order: number
  votesCount: number
  percentage: number
}

interface Poll {
  id: string
  title: string
  description: string | null
  adminId: string
  pointsReward: number
  expiryDate: string
  createdAt: string
  updatedAt: string
  admin: {
    id: string
    name: string
  }
  options: PollOption[]
  totalVotes: number
}

export default function PollResultsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Poll[]; count: number }>(
        '/api/polls',
        false
      )

      if (response.success && response.data) {
        setPolls(response.data)
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ في تحميل الاستطلاعات',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'gregory',
    })
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/polls">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للاستطلاعات
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                نتائج الاستطلاعات
              </h1>
              <p className="text-muted-foreground mt-1">
                جميع الاستطلاعات ونتائجها
              </p>
            </div>
          </div>
        </div>

        {/* Polls Grid */}
        {polls.length === 0 ? (
          <div className="text-center py-16">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              لا توجد استطلاعات
            </h3>
            <p className="text-muted-foreground">
              لم يتم إنشاء أي استطلاعات رأي بعد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll, index) => {
              const expired = isExpired(poll.expiryDate)
              const totalVotes = poll.totalVotes

              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg"
                    onClick={() => router.push(`/polls/results/${poll.id}`)}
                  >
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        {expired ? (
                          <div className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                            منتهي
                          </div>
                        ) : (
                          <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            نشط
                          </div>
                        )}
                      </div>

                      {/* Circular Progress */}
                      <div className="flex justify-center mb-6 mt-6">
                        <div className="relative w-32 h-32">
                          {/* Background Circle */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-muted"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 56}`}
                              strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(totalVotes / 100, 1))}`}
                              className="text-primary transition-all duration-1000"
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Users className="h-6 w-6 text-primary mb-1" />
                            <span className="text-2xl font-bold">{totalVotes}</span>
                            <span className="text-xs text-muted-foreground">صوت</span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-center mb-3 line-clamp-2">
                        {poll.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(poll.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              {poll.pointsReward}
                            </span>
                          </div>
                        </div>

                        {!expired && (
                          <div className="flex items-center gap-1 text-primary">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">
                              ينتهي في {formatDate(poll.expiryDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View Details Button */}
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/polls/results/${poll.id}`)
                        }}
                      >
                        عرض التفاصيل
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
