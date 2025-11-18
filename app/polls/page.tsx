'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import {
  Discussion,
  DiscussionsResponse,
  SessionPoll,
  SessionPollResponse,
  MeetLinkResponse,
  PollVoteResponse
} from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, CheckCircle2, Video, Calendar, Award } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function PollsPage() {
  const [latestSession, setLatestSession] = useState<Discussion | null>(null)
  const [sessionPoll, setSessionPoll] = useState<SessionPoll | null>(null)
  const [meetLink, setMeetLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [pollEnded, setPollEnded] = useState(false)
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    fetchLatestSession()
  }, [])

  useEffect(() => {
    if (sessionPoll && !hasVoted) {
      const interval = setInterval(() => {
        const endTime = new Date(sessionPoll.endDate).getTime()
        const now = new Date().getTime()
        const diff = endTime - now

        if (diff <= 0) {
          setTimeRemaining('انتهى الاستطلاع')
          setPollEnded(true)
          clearInterval(interval)
          // Fetch meet link when poll ends
          if (latestSession) {
            fetchMeetLink(latestSession.id)
          }
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
  }, [sessionPoll, hasVoted, latestSession])

  const fetchLatestSession = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<DiscussionsResponse>('/api/discussions')

      if (response.success && response.data && response.data.length > 0) {
        // Get the latest session (most recent)
        const sessions = response.data
        const latest = sessions.reduce((prev, current) => {
          return new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
        })

        // Check if session date hasn't passed yet
        const sessionDate = new Date(latest.dateTime).getTime()
        const now = new Date().getTime()

        if (sessionDate > now) {
          setLatestSession(latest)
          // Fetch poll for this session
          await fetchSessionPoll(latest.id)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionPoll = async (sessionId: string) => {
    try {
      const response = await apiClient.get<SessionPollResponse>(
        `/api/discussions/${sessionId}/poll`
      )

      if (response.success && response.data) {
        setSessionPoll(response.data)

        // Check if poll has ended
        const endTime = new Date(response.data.endDate).getTime()
        const now = new Date().getTime()

        if (endTime <= now) {
          setPollEnded(true)
          // Fetch meet link
          await fetchMeetLink(sessionId)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchMeetLink = async (sessionId: string) => {
    try {
      const response = await apiClient.get<MeetLinkResponse>(
        `/api/discussions/${sessionId}/meet-link`
      )

      if (response.success && response.data) {
        setMeetLink(response.data.meetLink)
      } else {
        setMeetLink(null)
      }
    } catch (error) {
      console.error(error)
      setMeetLink(null)
    }
  }

  const handleVote = async () => {
    if (!sessionPoll || !selectedOption || voting) return

    try {
      setVoting(true)
      const response = await apiClient.post<PollVoteResponse>(
        `/api/discussions/${sessionPoll.sessionId}/poll/vote`,
        { optionId: selectedOption },
        true
      )

      if (response.success) {
        setHasVoted(true)
        toast({
          title: 'تم التصويت بنجاح!',
          description: `لقد حصلت على ${response.data.points} نقطة`,
          variant: 'success',
        })
        // Refresh poll to show updated vote counts
        if (latestSession) {
          await fetchSessionPoll(latestSession.id)
        }
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل التصويت',
        variant: 'destructive',
      })
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

  if (!latestSession) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الجلسات الحوارية</h1>
          <p className="text-muted-foreground">لا توجد جلسات نشطة حالياً</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بانتظار الجلسة القادمة</CardTitle>
            <CardDescription>
              سيتم إشعارك عند توفر جلسة حوارية جديدة
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Show meet link if poll has ended
  if (pollEnded && meetLink) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الجلسات الحوارية</h1>
          <p className="text-muted-foreground">الجلسة متاحة الآن</p>
        </div>

        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Video className="h-6 w-6 text-primary" />
              {latestSession.title}
            </CardTitle>
            <CardDescription className="text-base">{latestSession.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(latestSession.dateTime).toLocaleString('ar-EG', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                <span>{latestSession.pointsReward} نقطة للحضور</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>المقدم: {latestSession.admin.name}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => window.open(meetLink, '_blank')}
            >
              <Video className="h-5 w-5 ml-2" />
              الانضمام إلى الجلسة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show message if poll ended but no meet link yet
  if (pollEnded && !meetLink) {
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
              {latestSession.title}
            </CardTitle>
            <CardDescription>{latestSession.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                لم يتم إضافة رابط Google Meet لهذه الجلسة بعد. سيتم إشعارك عند توفر الرابط.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show poll voting
  if (sessionPoll && !hasVoted && !pollEnded) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الجلسات الحوارية</h1>
          <p className="text-muted-foreground">صوّت للمشاركة في الجلسة القادمة</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{latestSession.title}</CardTitle>
            <CardDescription className="text-base">{latestSession.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  موعد الجلسة: {new Date(latestSession.dateTime).toLocaleString('ar-EG', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                <span>{latestSession.pointsReward} نقطة للحضور</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>المقدم: {latestSession.admin.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>{sessionPoll.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              الوقت المتبقي: {timeRemaining}
            </CardDescription>
            <CardDescription className="text-sm">
              اكسب {sessionPoll.pointsReward} نقطة بالتصويت
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessionPoll.options.map((option, index) => {
              const totalVotes = sessionPoll.options.reduce((sum, opt) => sum + opt.voteCount, 0)
              const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={selectedOption === option.id ? 'default' : 'outline'}
                    className="w-full justify-between h-auto py-4 text-right"
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <span>{option.optionText}</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{option.voteCount} ({percentage}%)</span>
                    </div>
                  </Button>
                </motion.div>
              )
            })}

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleVote}
              disabled={!selectedOption || voting}
            >
              {voting ? 'جاري التصويت...' : 'تأكيد التصويت'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User has voted, waiting for poll to end
  if (hasVoted && !pollEnded) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">الجلسات الحوارية</h1>
          <p className="text-muted-foreground">تم التصويت بنجاح</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              شكراً لتصويتك!
            </CardTitle>
            <CardDescription>
              سيتم الإعلان عن رابط الجلسة عند انتهاء وقت الاستطلاع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>{latestSession.title}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                موعد الجلسة: {new Date(latestSession.dateTime).toLocaleString('ar-EG', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {sessionPoll && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">النتائج الحالية</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                ينتهي الاستطلاع خلال: {timeRemaining}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionPoll.options.map((option) => {
                const totalVotes = sessionPoll.options.reduce((sum, opt) => sum + opt.voteCount, 0)
                const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0

                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option.optionText}</span>
                      <span className="text-muted-foreground">{option.voteCount} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}
