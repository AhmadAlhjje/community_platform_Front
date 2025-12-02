'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import {
  PollVoteResponse
} from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, Video, Calendar, Award } from 'lucide-react'

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
  createdAt: string
  updatedAt: string
  admin: {
    id: string
    name: string
  }
  options: PollOption[]
  totalVotes: number
  userVote?: string
}

interface Discussion {
  id: string
  title: string
  description: string
  meetLink: string | null
  dateTime: string | null
  pointsReward: number
  adminId: string
  createdAt: string
  updatedAt: string
  admin: {
    id: string
    name: string
  }
  attendances: any[]
}

interface PollsResponse {
  success: boolean
  count: number
  data: Poll[]
}

interface DiscussionsResponse {
  success: boolean
  count: number
  data: Discussion[]
}


export default function PollsPage() {
  const [latestPoll, setLatestPoll] = useState<Poll | null>(null)
  const [latestDiscussion, setLatestDiscussion] = useState<Discussion | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [selectedVote, setSelectedVote] = useState<string>('')
  const [hasVoted, setHasVoted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [pollEnded, setPollEnded] = useState(false)
  const [meetLink, setMeetLink] = useState<string | null>(null)
  const [pollEndTime, setPollEndTime] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchLatestPoll()
  }, [])

  useEffect(() => {
    if (pollEndTime && !hasVoted && !pollEnded) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const diff = pollEndTime - now

        if (diff <= 0) {
          setTimeRemaining('انتهى الاستطلاع')
          setPollEnded(true)
          clearInterval(interval)
          fetchLatestDiscussionAfterPoll()
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          if (days > 0) {
            setTimeRemaining(`${days} يوم ${hours} ساعة`)
          } else if (hours > 0) {
            setTimeRemaining(`${hours} ساعة ${minutes} دقيقة`)
          } else if (minutes > 0) {
            setTimeRemaining(`${minutes} دقيقة ${seconds} ثانية`)
          } else {
            setTimeRemaining(`${seconds} ثانية`)
          }
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [pollEndTime, hasVoted, pollEnded])

  const fetchLatestPoll = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<PollsResponse>('/api/polls')

      if (response.success && response.data && response.data.length > 0) {
        // Get the latest poll (most recently created)
        const latest = response.data.reduce((prev, current) => {
          return new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
        })

        setLatestPoll(latest)

        // Parse poll end time (assuming poll duration is 24 hours)
        const endTime = new Date(latest.createdAt).getTime() + (24 * 60 * 60 * 1000) // 24 hours
        setPollEndTime(endTime)

        // Check if poll has already ended
        const now = new Date().getTime()
        if (endTime <= now) {
          setPollEnded(true)
          fetchLatestDiscussionAfterPoll()
        }
      } else {
        // No active polls, fetch discussions
        setPollEnded(true)
        fetchLatestDiscussionAfterPoll()
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الاستطلاع',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLatestDiscussionAfterPoll = async () => {
    try {
      const response = await apiClient.get<DiscussionsResponse>('/api/discussions')

      if (response.success && response.data && response.data.length > 0) {
        // Get the latest discussion (most recently created)
        const latest = response.data.reduce((prev, current) => {
          return new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
        })

        setLatestDiscussion(latest)
        // Fetch meet link if available
        if (latest.meetLink) {
          setMeetLink(latest.meetLink)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleVote = async () => {
    if (!latestPoll || !selectedVote || voting) return

    try {
      setVoting(true)
      const response = await apiClient.post<PollVoteResponse>(
        `/api/polls/${latestPoll.id}/vote`,
        { optionId: selectedVote },
        true
      )

      if (response.success) {
        // Update the poll with new vote data
        const updatedPoll = {
          ...latestPoll,
          userVote: selectedVote,
          totalVotes: latestPoll.totalVotes + 1,
          options: latestPoll.options.map(option => {
            if (option.id === selectedVote) {
              const newVotesCount = option.votesCount + 1
              const newPercentage = ((newVotesCount / (latestPoll.totalVotes + 1)) * 100)
              return {
                ...option,
                votesCount: newVotesCount,
                percentage: Math.round(newPercentage * 10) / 10
              }
            }
            // Recalculate percentage for other options
            const newPercentage = ((option.votesCount / (latestPoll.totalVotes + 1)) * 100)
            return {
              ...option,
              percentage: Math.round(newPercentage * 10) / 10
            }
          })
        }
        setLatestPoll(updatedPoll)
        setHasVoted(true)
        toast({
          title: 'تم التصويت بنجاح!',
          description: 'شكراً لتصويتك على هذا الاستطلاع',
          variant: 'success',
        })
      }
    } catch (error: any) {
      if (error.message && error.message.includes('صوّت')) {
        // Poll already voted - update userVote
        setLatestPoll(prev => prev ? { ...prev, userVote: selectedVote } : null)
        setHasVoted(true)
        toast({
          title: 'لا يمكن التصويت مرتين',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'خطأ',
          description: error.message || 'فشل التصويت',
          variant: 'destructive',
        })
      }
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  // Show discussion if poll ended and discussion exists
  if (pollEnded && latestDiscussion) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الجلسات الحوارية</h1>
          <p className="text-muted-foreground">انتهى الاستطلاع - إليك الجلسة القادمة</p>
        </div>

        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Video className="h-6 w-6 text-primary" />
              {latestDiscussion.title}
            </CardTitle>
            <CardDescription className="text-base">{latestDiscussion.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              {latestDiscussion.dateTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(latestDiscussion.dateTime).toLocaleString('ar-EG', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              )}
            </div>

            {meetLink && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => window.open(meetLink, '_blank')}
              >
                <Video className="h-5 w-5 ml-2" />
                الانضمام إلى الجلسة
              </Button>
            )}

            {!meetLink && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  رابط الجلسة سيتم إضافته قريباً
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show message if poll ended but no matching discussion
  if (pollEnded && !latestDiscussion) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الجلسات الحوارية</h1>
          <p className="text-muted-foreground">انتهى الاستطلاع</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              شكراً لتصويتك!
            </CardTitle>
            <CardDescription>
              سيتم إضافة جلسة حوارية قريباً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                لم يتم إضافة جلسة حوارية تابعة لهذا الاستطلاع حتى الآن
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show poll voting (default state) if poll exists
  if (latestPoll) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الستبيان الوعي المجتمعي</h1>
          <p className="text-muted-foreground">شارك رأيك وساهم في بناء مجتمعنا</p>
        </div>

        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-2xl">{latestPoll.title || 'استطلاع الرأي'}</CardTitle>
            {latestPoll.description && (
              <CardDescription className="text-base">{latestPoll.description}</CardDescription>
            )}
            <CardDescription className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4" />
              الوقت المتبقي: {timeRemaining}
            </CardDescription>
            <CardDescription className="text-sm">
              اكسب {latestPoll.pointsReward} نقطة بالتصويت
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {latestPoll.options.map((option, index) => {
                const isSelected = selectedVote === option.id
                const isUserVote = latestPoll.userVote === option.id

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      onClick={() => !hasVoted && setSelectedVote(option.id)}
                      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected || isUserVote
                          ? 'ring-2 ring-primary'
                          : 'border border-input hover:border-primary/50'
                      } ${hasVoted ? 'cursor-not-allowed' : ''}`}
                    >
                      {/* Background bar for percentage */}
                      <div
                        className="absolute inset-0 bg-primary/10 transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      />

                      {/* Content */}
                      <div className="relative p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isUserVote && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          {!isUserVote && (
                            <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                              isSelected ? 'border-primary bg-primary/20' : 'border-gray-300'
                            }`} />
                          )}
                          <span className="text-right flex-1 text-base font-medium">{option.text}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary ml-4">
                          {option.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {!hasVoted && (
                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleVote}
                  disabled={!selectedVote || voting}
                >
                  {voting ? 'جاري التصويت...' : 'تأكيد التصويت'}
                </Button>
              )}

              {hasVoted && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    ✓ شكراً لتصويتك
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {hasVoted && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
                شكراً لتصويتك!
              </CardTitle>
              <CardDescription>
                سيتم الإعلان عن الجلسة الحوارية عند انتهاء وقت الاستطلاع
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    )
  }

  // Fallback if no poll and no discussion
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">الستبيان الوعي المجتمعي</h1>
        <p className="text-muted-foreground">لا توجد استطلاعات نشطة حالياً</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بانتظار استطلاع جديد</CardTitle>
          <CardDescription>
            سيتم إشعارك عند توفر استطلاع جديد
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
