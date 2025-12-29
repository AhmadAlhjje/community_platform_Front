'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Calendar, Award, User } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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

export default function PollDetailPage() {
  const params = useParams()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchPoll()
  }, [params.id])

  const fetchPoll = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Poll[] }>(
        '/api/polls',
        false
      )

      if (response.success && response.data) {
        const foundPoll = response.data.find((p) => p.id === params.id)
        if (foundPoll) {
          setPoll(foundPoll)
        } else {
          toast({
            title: 'خطأ',
            description: 'لم يتم العثور على الاستطلاع',
            variant: 'destructive',
          })
        }
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ في تحميل الاستطلاع',
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

  const getTopOption = (options: PollOption[]) => {
    return options.reduce((prev, current) =>
      current.votesCount > prev.votesCount ? current : prev
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">لم يتم العثور على الاستطلاع</p>
        <Link href="/polls/results">
          <Button>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة
          </Button>
        </Link>
      </div>
    )
  }

  const topOption = getTopOption(poll.options)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/polls/results">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للنتائج
          </Button>
        </Link>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl md:text-3xl">{poll.title}</CardTitle>
            {poll.description && (
              <p className="text-muted-foreground mt-2">{poll.description}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(poll.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{poll.totalVotes} صوت</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {poll.pointsReward} نقطة
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Results */}
            <div className="space-y-4">
              {poll.options
                .sort((a, b) => a.order - b.order)
                .map((option, index) => {
                  const isTop = option.id === topOption.id && poll.totalVotes > 0

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.text}</span>
                          {isTop && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                              الأعلى
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">
                            {option.percentage.toFixed(1)}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({option.votesCount})
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${option.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className={`h-full rounded-full ${
                            isTop ? 'bg-amber-500' : 'bg-primary'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )
                })}
            </div>

            {/* Summary */}
            {poll.totalVotes === 0 && (
              <div className="mt-6 text-center py-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">لا توجد أصوات بعد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
