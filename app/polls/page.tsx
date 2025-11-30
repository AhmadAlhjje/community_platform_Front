'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import {
  Discussion,
  DiscussionsResponse,
  PollVoteResponse
} from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, CheckCircle2, Video, Calendar, Award } from 'lucide-react'

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
}

interface PollsResponse {
  success: boolean
  count: number
  data: Poll[]
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

        // Check if discussion date is after poll end time
        if (pollEndTime && latest.dateTime) {
          const discussionDate = new Date(latest.dateTime).getTime()

          if (discussionDate > pollEndTime) {
            setLatestDiscussion(latest)
            // Fetch meet link if available
            if (latest.meetLink) {
              setMeetLink(latest.meetLink)
            }
          }
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
        { vote: selectedVote },
        true
      )

      if (response.success) {
        setHasVoted(true)
        toast({
          title: 'تم التصويت بنجاح!',
          description: 'شكراً لتصويتك على هذا الاستطلاع',
          variant: 'success',
        })
      }
    } catch (error: any) {
      if (error.message && error.message.includes('صوّت')) {
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

  if (!latestPoll) {
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

  // Show discussion if poll ended and discussion exists with date after poll
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
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(latestDiscussion.dateTime).toLocaleString('ar-EG', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                <span>{latestDiscussion.pointsReward} نقطة للحضور</span>
              </div>
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

  // Show poll voting (default state)
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
            {['نعم', 'لا', 'محايد'].map((option, index) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={selectedVote === option ? 'default' : 'outline'}
                  className="w-full h-12 text-right"
                  onClick={() => setSelectedVote(option)}
                >
                  {option}
                </Button>
              </motion.div>
            ))}

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleVote}
              disabled={!selectedVote || voting}
            >
              {voting ? 'جاري التصويت...' : 'تأكيد التصويت'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasVoted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
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
