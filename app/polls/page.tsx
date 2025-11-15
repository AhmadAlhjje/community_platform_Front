'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Poll, DiscussionSession } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, CheckCircle2, Video } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function PollsPage() {
  const [activePoll, setActivePoll] = useState<Poll | null>(null)
  const [activeSession, setActiveSession] = useState<DiscussionSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    fetchPollAndSession()
  }, [])

  useEffect(() => {
    if (activePoll && !activePoll.hasVoted) {
      const interval = setInterval(() => {
        const endTime = new Date(activePoll.endDate).getTime()
        const now = new Date().getTime()
        const diff = endTime - now

        if (diff <= 0) {
          setTimeRemaining('انتهى')
          clearInterval(interval)
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          setTimeRemaining(`${days}د ${hours}س ${minutes}د ${seconds}ث`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [activePoll])

  const fetchPollAndSession = async () => {
    try {
      setLoading(true)
      // Fetch active poll
      const pollsResponse = await apiClient.get<{ polls: Poll[] }>('/api/polls')
      const polls = pollsResponse.polls || []
      const active = polls.find((p) => new Date(p.endDate).getTime() > new Date().getTime())
      setActivePoll(active || null)

      // Fetch active session
      const sessionsResponse = await apiClient.get<{ sessions: DiscussionSession[] }>('/api/discussions')
      const sessions = sessionsResponse.sessions || []
      const activeSessionData = sessions.find((s) => s.status === 'active' && s.meetLink)
      setActiveSession(activeSessionData || null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (option: string) => {
    if (!activePoll || voting) return

    try {
      setVoting(true)
      await apiClient.post(`/api/polls/${activePoll.id}/vote`, { option }, true)
      toast({
        title: t('common.success'),
        description: t('polls.voteSuccess'),
        variant: 'success',
      })
      fetchPollAndSession()
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || 'فشل التصويت',
        variant: 'destructive',
      })
    } finally {
      setVoting(false)
    }
  }

  const handleAttend = async () => {
    if (!activeSession) return

    try {
      await apiClient.post(`/api/discussions/${activeSession.id}/attend`, {}, true)
      toast({
        title: t('common.success'),
        description: t('polls.attendSuccess'),
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  // Case 1: Active poll with voting
  if (activePoll && !activePoll.hasVoted && new Date(activePoll.endDate).getTime() > new Date().getTime()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('polls.title')}</h1>
          <p className="text-muted-foreground">{t('polls.votingActive')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{activePoll.question}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('polls.timeRemaining')}: {timeRemaining}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePoll.options.map((option, index) => {
              const votes = activePoll.votes?.[option] || 0
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-4"
                    onClick={() => handleVote(option)}
                    disabled={voting}
                  >
                    <span className="text-right">{option}</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{votes}</span>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Case 2: User has voted, waiting for meeting
  if (activePoll && activePoll.hasVoted && !activeSession) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('polls.title')}</h1>
          <p className="text-muted-foreground">{t('polls.waitingForMeeting')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-success" />
              {t('polls.voted')}
            </CardTitle>
            <CardDescription>
              تم تسجيل تصويتك بنجاح. سيتم الإعلان عن الجلسة قريباً.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Case 3: Meeting is active
  if (activeSession && activeSession.meetLink) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('polls.title')}</h1>
          <p className="text-muted-foreground">{t('polls.meetingActive')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              {activeSession.title}
            </CardTitle>
            <CardDescription>{activeSession.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                الوقت: {new Date(activeSession.scheduledDate).toLocaleString('ar-EG')}
              </p>
              <p className="text-sm text-muted-foreground">
                المدة: {activeSession.duration} دقيقة
              </p>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                handleAttend()
                window.open(activeSession.meetLink, '_blank')
              }}
            >
              <Video className="h-5 w-5 ml-2" />
              {t('polls.joinMeeting')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Case 4: Waiting for next poll
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('polls.title')}</h1>
        <p className="text-muted-foreground">{t('polls.waitingForNextPoll')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('polls.noActivePoll')}</CardTitle>
          <CardDescription>
            بانتظار الاستبيان القادم. سيتم إشعارك عند توفر استبيان جديد.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
