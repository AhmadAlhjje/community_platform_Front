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

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/30">
          <div className={`absolute inset-0 ${
            isPuzzle
              ? 'bg-blue-500/5'
              : 'bg-emerald-500/5'
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
    <div className="w-full min-h-screen space-y-8 pb-8">


      {puzzleGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Puzzle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">ألعاب الأحجية</h2>
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
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Grid3x3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">الكلمات المتقاطعة</h2>
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
