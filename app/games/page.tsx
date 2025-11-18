'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Game } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Puzzle, Grid3x3, CheckCircle2, Award, Star, Trophy } from 'lucide-react'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Game[] }>('/api/games')
      setGames(response.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const puzzleGames = games.filter((g) => g.type === 'puzzle')
  const crosswordGames = games.filter((g) => g.type === 'crossword')

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
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25"></div>
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
            <Puzzle className="h-8 w-8 text-white" />
          </div>
        </div>
      )
    }
    return (
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-25"></div>
        <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-lg">
          <Grid3x3 className="h-8 w-8 text-white" />
        </div>
      </div>
    )
  }

  const GameCard = ({ game, index }: { game: Game; index: number }) => {
    const isPuzzle = game.type === 'puzzle'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            isPuzzle
              ? 'from-purple-500/5 to-pink-500/5'
              : 'from-green-500/5 to-emerald-500/5'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

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

            <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
              {game.title}
            </CardTitle>

            <CardDescription className="line-clamp-2 text-sm">
              {game.educationalMessage}
            </CardDescription>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                <Award className="h-3 w-3" />
                {game.pointsReward} نقطة
              </div>
            </div>
          </CardHeader>

          <CardContent className="mt-auto relative">
            <Button
              onClick={() => handlePlayGame(game)}
              className={`w-full group-hover:scale-105 transition-transform ${
                isPuzzle
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
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
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 rounded-lg blur opacity-20"></div>
        <div className="relative bg-background border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('games.title')}
            </h1>
          </div>
          <p className="text-muted-foreground mr-11">
            اختر لعبة واستمتع بالتعلم واكسب النقاط
          </p>
        </div>
      </motion.div>

      {puzzleGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Puzzle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">ألعاب الأحجية</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {puzzleGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {crosswordGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
              <Grid3x3 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">الكلمات المتقاطعة</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {crosswordGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {games.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[300px] gap-4"
        >
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-full">
            <Puzzle className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-bold">لا توجد ألعاب متاحة حالياً</h3>
          <p className="text-muted-foreground">تحقق مرة أخرى لاحقاً</p>
        </motion.div>
      )}
    </div>
  )
}
