'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { MessageSquare, TrendingUp, Sparkles, ChevronLeft } from 'lucide-react'

interface Poll {
  id: string
  title: string
  createdAt: string
  expiryDate?: string | null
}

export function ActivePollsTicker() {
  const { user } = useAuth()
  const [latestPoll, setLatestPoll] = useState<Poll | null>(null)

  useEffect(() => {
    // جلب آخر استبيان النشط
    const fetchLatestPoll = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/polls`)
        const data = await response.json()
        if (data.success && data.data && data.data.length > 0) {
          // البحث عن أول استبيان لم ينتهِ بعد
          const now = new Date()
          const activePoll = data.data.find((poll: Poll) => {
            // إذا لم يكن هناك تاريخ انتهاء، فالاستبيان نشط
            if (!poll.expiryDate) return true

            // التحقق من أن تاريخ الانتهاء لم يمر بعد
            const expiryDate = new Date(poll.expiryDate)
            return expiryDate > now
          })

          if (activePoll) {
            setLatestPoll(activePoll)
          }
        }
      } catch (error) {
        console.error('Error fetching polls:', error)
      }
    }

    fetchLatestPoll()
  }, [])

  if (!latestPoll) return null

  return (
    <div className="relative w-full bg-gradient-to-l from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20 py-4 overflow-hidden">
      {/* خلفية متحركة من اليمين لليسار */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.15) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* المحتوى المتحرك */}
      <div className="relative">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-6 whitespace-nowrap"
        >
          {/* تكرار المحتوى لضمان الحركة المستمرة */}
          {[1, 2, 3].map((iteration) => (
            <div key={iteration} className="flex items-center gap-6">
              {/* شارة "جديد" */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-full text-primary-foreground font-bold text-sm shadow-lg"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                جديد
              </motion.div>

              {/* محتوى الاستبيان */}
              <Link
                href={user ? "/polls" : "/auth/login"}
                className="group flex items-center gap-3 px-8 py-3 bg-card/90 backdrop-blur-sm rounded-full border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <MessageSquare className="h-5 w-5 text-primary" />
                </motion.div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-base">استبيان جديد:</span>
                  <span className="text-foreground/90 font-medium group-hover:text-primary transition-colors">
                    {latestPoll.title}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{
                      x: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-primary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.div>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </Link>

              {/* دعوة للمشاركة */}
              <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/30">
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-2xl"
                >
                  👈
                </motion.span>
                <span className="font-bold text-foreground">شارك برأيك الآن!</span>
              </div>

              {/* فاصل */}
              <div className="w-px h-8 bg-primary/20" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* تأثيرات ضوئية على الجوانب */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none z-10" />
    </div>
  )
}
