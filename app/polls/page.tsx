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
import { Clock, CheckCircle2, Video, Calendar, Award, MessageSquare, Sparkles, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
  expiryDate: string | null
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
        const now = new Date().getTime()

        // Filter active polls (not expired)
        const activePolls = response.data.filter((poll: Poll) => {
          if (!poll.expiryDate) return true // No expiry date means always active
          return new Date(poll.expiryDate).getTime() > now
        })

        if (activePolls.length > 0) {
          // Get the latest active poll (most recently created)
          const latest = activePolls.reduce((prev, current) => {
            return new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
          })

          setLatestPoll(latest)

          // Parse poll end time from expiryDate or default to 24 hours
          let endTime: number
          if (latest.expiryDate) {
            endTime = new Date(latest.expiryDate).getTime()
          } else {
            endTime = new Date(latest.createdAt).getTime() + (24 * 60 * 60 * 1000) // 24 hours default
          }
          setPollEndTime(endTime)

          // Check if poll has already ended
          if (endTime <= now) {
            setPollEnded(true)
            fetchLatestDiscussionAfterPoll()
          }
        } else {
          // No active polls, fetch discussions
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
      <div className="space-y-8">
        {/* Discussion Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-8 md:p-12"
          style={{
            backgroundImage: 'url(/images/hero-community.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/55 to-background/60" />

          <div className="relative space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
              <span className="text-green-700 dark:text-green-400 font-semibold">انتهى الاستطلاع</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              الجلسة <span className="text-primary">الحوارية القادمة</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              شارك في النقاش المباشر وأضف صوتك إلى الحوار
            </p>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-primary/50 shadow-xl">
              <div className="absolute inset-0 opacity-10">
                <Image src="/images/OIP2.jpeg" alt="Discussion" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/95 to-background/98" />

              <CardHeader className="relative">
                <div className="flex items-start gap-3 mb-4">
                  <motion.div
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                  >
                    <Video className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{latestDiscussion.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{latestDiscussion.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                {latestDiscussion.dateTime && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">موعد الجلسة</p>
                      <p className="font-semibold">
                        {new Date(latestDiscussion.dateTime).toLocaleString('en-GB', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                          calendar: 'gregory',
                        })}
                      </p>
                    </div>
                  </motion.div>
                )}

                {meetLink ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg"
                      size="lg"
                      onClick={() => window.open(meetLink, '_blank')}
                    >
                      <Video className="h-5 w-5 ml-2" />
                      <span className="font-semibold">الانضمام إلى الجلسة</span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg text-center"
                  >
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                      ⏳ رابط الجلسة سيتم إضافته قريباً
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show message if poll ended but no matching discussion
  if (pollEnded && !latestDiscussion) {
    return (
      <div className="space-y-8">
        {/* Thank You Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden p-8 md:p-12"
          style={{
            backgroundImage: 'url(/images/OIP1.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

          <div className="relative flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            >
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                شكراً <span className="text-primary">لتصويتك!</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-4">
                انتهى الاستطلاع - رأيك مهم لنا
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <Image src="/images/hero-community.webp" alt="Thank You" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/98" />

              <CardContent className="relative p-8 text-center space-y-6">
                <div className="text-6xl mb-4">🙏</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">تم استلام تصويتك</h3>
                  <p className="text-muted-foreground">
                    شكراً لمشاركتك في بناء مجتمع أفضل
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg"
                >
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    ⏳ سيتم الإعلان عن الجلسة الحوارية قريباً
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show poll voting (default state) if poll exists
  if (latestPoll) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-8 md:p-12"
          style={{
            backgroundImage: 'url(/images/OIP2.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

          <div className="relative space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 rounded-full border-2 border-foreground/20 shadow-lg backdrop-blur-sm"
            >
              <MessageSquare className="h-5 w-5 text-foreground drop-shadow-md" />
              <span className="text-foreground font-bold drop-shadow-md">شارك برأيك!</span>
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  صوّت وشارك في <span className="text-primary">القرارات!</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mt-2">
                  استبيانات مجتمعية لمعرفة آراء الجميع وبناء مستقبل أفضل
                </p>
              </div>
              <Link href="/polls/results">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/50 hover:bg-primary/10"
                >
                  <BarChart3 className="h-5 w-5 ml-2" />
                  النتائج السابقة
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="relative overflow-hidden border-primary/50 shadow-xl">
          {/* صورة الخلفية */}
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/OIP2.jpeg" alt="Poll" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/95 to-background/98" />

          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg"
              >
                <MessageSquare className="h-7 w-7 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full border border-amber-200/50 dark:border-amber-800/50"
              >
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {latestPoll.pointsReward} نقطة
                </span>
              </motion.div>
            </div>
            <CardTitle className="text-2xl mt-4">{latestPoll.title || 'استطلاع الرأي'}</CardTitle>
            {latestPoll.description && (
              <CardDescription className="text-base">{latestPoll.description}</CardDescription>
            )}
            <CardDescription className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4" />
              الوقت المتبقي: <span className="font-semibold text-primary">{timeRemaining}</span>
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full mt-4 relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl"
                    size="lg"
                    onClick={handleVote}
                    disabled={!selectedVote || voting}
                  >
                    <span className="font-semibold">
                      {voting ? 'جاري التصويت...' : 'تأكيد التصويت'}
                    </span>
                    {!voting && (
                      <motion.div
                        animate={{ x: [-2, 0, -2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mr-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
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
      </div>
    )
  }

  // Fallback if no poll and no discussion
  return (
    <div className="space-y-8">
      {/* No Polls Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-8 md:p-12"
        style={{
          backgroundImage: 'url(/images/استبيان.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/55 to-background/60" />

        <div className="relative space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 rounded-full border-2 border-foreground/20 shadow-lg backdrop-blur-sm"
          >
            <MessageSquare className="h-5 w-5 text-foreground drop-shadow-md" />
            <span className="text-foreground font-bold drop-shadow-md">الاستبيانات المجتمعية</span>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                لا توجد استطلاعات <span className="text-primary">حالياً</span>
              </h1>
            </div>
            <Link href="/polls/results">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                <BarChart3 className="h-5 w-5 ml-2" />
                عرض النتائج
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            تابعنا للحصول على إشعار عند إضافة استطلاع جديد
          </p>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Image src="/images/hero-community.webp" alt="Waiting" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/98" />

            <CardContent className="relative p-8 text-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📋
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-2">بانتظار استطلاع جديد</h3>
                <p className="text-muted-foreground">
                  سيتم إشعارك فوراً عند توفر استطلاع جديد
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg"
              >
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  💡 تابع المنصة للمشاركة في الاستطلاعات القادمة وكسب النقاط
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
