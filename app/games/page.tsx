'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Game, UserGameHistoryResponse } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Puzzle, Grid3x3, CheckCircle2, Award, Star, Trophy, Gamepad2, Sparkles } from 'lucide-react'
import Image from 'next/image'

type TabType = 'puzzle' | 'crossword' | 'completed'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [completedGameIds, setCompletedGameIds] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<TabType>('puzzle')
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchGamesAndHistory()
  }, [])

  const fetchGamesAndHistory = async () => {
    try {
      setLoading(true)

      // Fetch both games and user history in parallel
      const [gamesResponse, historyResponse] = await Promise.all([
        apiClient.get<{ success: boolean; count: number; data: Game[] }>('/api/games'),
        apiClient.get<UserGameHistoryResponse>('/api/games/user/history', true).catch(() => null)
      ])

      // Process games
      if (gamesResponse.success && Array.isArray(gamesResponse.data)) {
        // Get completed game IDs from history
        const completedIds = new Set<string>()
        if (historyResponse?.success && historyResponse.data) {
          historyResponse.data.forEach(history => {
            if (history.completed) {
              completedIds.add(history.gameId)
            }
          })
        }

        setCompletedGameIds(completedIds)

        // Mark games as completed based on history
        const gamesWithCompletionStatus = gamesResponse.data.map(game => ({
          ...game,
          isCompleted: completedIds.has(game.id)
        }))

        setGames(gamesWithCompletionStatus)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل الألعاب',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const puzzleGames = games.filter((g) => g.type === 'puzzle' && !g.isCompleted)
  const crosswordGames = games.filter((g) => g.type === 'crossword' && !g.isCompleted)
  const completedGames = games.filter((g) => g.isCompleted)

  const getFilteredGames = () => {
    switch (activeTab) {
      case 'puzzle':
        return puzzleGames
      case 'crossword':
        return crosswordGames
      case 'completed':
        return completedGames
      default:
        return []
    }
  }

  const filteredGames = getFilteredGames()

  const handlePlayGame = (game: Game) => {
    if (game.isCompleted) {
      toast({
        title: 'تم إكمال هذه اللعبة مسبقاً',
        description: 'لقد أكملت هذه اللعبة من قبل ولا يمكنك لعبها مرة أخرى',
        variant: 'destructive',
      })
      return
    }

    const gameLink = game.type === 'puzzle' ? `/games/puzzle/${game.id}` : `/games/crossword/${game.id}`
    router.push(gameLink)
  }

  const GameIcon = ({ type }: { type: 'puzzle' | 'crossword' }) => {
    if (type === 'puzzle') {
      return (
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Puzzle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      )
    }
    return (
      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
        <Grid3x3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>
    )
  }

  const GameCard = ({ game, index }: { game: Game; index: number }) => {
    const isPuzzle = game.type === 'puzzle'
    const gameImage = isPuzzle ? '/images/hero-community.webp' : '/images/OIP2.jpeg'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 cursor-pointer">
          {/* صورة الخلفية */}
          <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
            <Image
              src={gameImage}
              alt={game.title}
              fill
              className="object-cover"
            />
          </div>
          <div className={`absolute inset-0 ${
            isPuzzle
              ? 'bg-gradient-to-br from-blue-500/10 via-background/90 to-background/95'
              : 'bg-gradient-to-br from-emerald-500/10 via-background/90 to-background/95'
          } group-hover:via-background/85 transition-all duration-300`} />

          <CardHeader className="relative">
            <div className="flex items-start justify-between mb-4">
              <GameIcon type={game.type} />
              {game.isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  مكتملة
                </motion.div>
              )}
            </div>

            <CardTitle className="text-lg line-clamp-2 text-foreground">
              {game.title}
            </CardTitle>

            <CardDescription className="line-clamp-2 text-sm mt-2">
              {game.educationalMessage}
            </CardDescription>

            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                <Trophy className="h-3 w-3" />
                {game.pointsReward} نقطة
              </div>
            </div>
          </CardHeader>

          <CardContent className="mt-auto relative">
            <Button
              onClick={() => handlePlayGame(game)}
              className="w-full transition-all"
              variant={game.isCompleted ? 'outline' : 'default'}
            >
              {game.isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                  تم الإكمال
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 ml-2" />
                  العب الآن
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
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
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

          <div className="relative space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gamepad2 className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-primary font-semibold">ألعاب تفاعلية ممتعة!</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              العب وتعلم واربح <span className="text-primary">نقاطاً!</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              اختبر معلوماتك وتعلم بطريقة تفاعلية من خلال ألعاب البازل والكلمات المتقاطعة
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 sm:gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab('puzzle')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'puzzle'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Puzzle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">ألعاب البازل</span>
            <span className="inline sm:hidden">البازل</span>
            {puzzleGames.length > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">
                {puzzleGames.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('crossword')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'crossword'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Grid3x3 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">الكلمات المتقاطعة</span>
            <span className="inline sm:hidden">متقاطعة</span>
            {crosswordGames.length > 0 && (
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">
                {crosswordGames.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'completed'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">تم حلها</span>
            <span className="inline sm:hidden">محلولة</span>
            {completedGames.length > 0 && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">
                {completedGames.length}
              </span>
            )}
          </button>
        </motion.div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[300px] gap-4"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              {activeTab === 'puzzle' && <Puzzle className="h-12 w-12 text-gray-400" />}
              {activeTab === 'crossword' && <Grid3x3 className="h-12 w-12 text-gray-400" />}
              {activeTab === 'completed' && <CheckCircle2 className="h-12 w-12 text-gray-400" />}
            </div>
            <h3 className="text-xl font-bold">لا توجد ألعاب في هذا القسم</h3>
            <p className="text-muted-foreground">جرّب قسماً آخر أو تحقق مرة أخرى لاحقاً</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
