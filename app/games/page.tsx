'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Game } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Puzzle, Grid3x3, CheckCircle2 } from 'lucide-react'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await apiClient.get<{ games: Game[] }>('/api/games')
      setGames(response.games || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const puzzleGames = games.filter((g) => g.type === 'puzzle')
  const crosswordGames = games.filter((g) => g.type === 'crossword')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('games.title')}</h1>
        <p className="text-muted-foreground">اختر لعبة وابدأ المتعة</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p>{t('common.loading')}</p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Puzzle className="h-6 w-6" />
              {t('games.puzzle')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {puzzleGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Puzzle className="h-6 w-6 text-primary" />
                        {game.isCompleted && (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{game.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {game.description}
                      </CardDescription>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-accent">
                          {t(`games.${game.difficulty}`)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Link href={`/games/puzzle/${game.id}`}>
                        <Button className="w-full" disabled={game.isCompleted}>
                          {game.isCompleted
                            ? t('games.completed')
                            : t('games.playNow')}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Grid3x3 className="h-6 w-6" />
              {t('games.crossword')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {crosswordGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Grid3x3 className="h-6 w-6 text-success" />
                        {game.isCompleted && (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{game.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {game.description}
                      </CardDescription>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-accent">
                          {t(`games.${game.difficulty}`)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Link href={`/games/crossword/${game.id}`}>
                        <Button
                          variant="success"
                          className="w-full"
                          disabled={game.isCompleted}
                        >
                          {game.isCompleted
                            ? t('games.completed')
                            : t('games.playNow')}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
