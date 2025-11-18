'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Game } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, Lightbulb, Award, Sparkles, RotateCcw, X } from 'lucide-react'
import Link from 'next/link'

interface PuzzleData {
  pieces: number
  image?: string
  difficulty: string
}

export default function PuzzlePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null)
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [startTime] = useState(Date.now())
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchGame()
  }, [params.id])

  const fetchGame = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Game }>(`/api/games/${params.id}`)

      // Check if game is already completed
      if (response.data.isCompleted) {
        toast({
          title: 'تم إكمال هذه اللعبة مسبقاً',
          description: 'لقد أكملت هذه اللعبة من قبل',
          variant: 'default',
        })
        router.push('/games')
        return
      }

      setGame(response.data)

      // Parse the content JSON
      const content = JSON.parse(response.data.content)
      setPuzzleData(content)

      // Initialize puzzle tiles
      const gridSize = content.pieces || 9
      initializePuzzle(gridSize)
    } catch (error) {
      console.error(error)
    }
  }

  const initializePuzzle = (pieces: number) => {
    // Create array of tiles (0 represents empty space)
    const tileArray = Array.from({ length: pieces }, (_, i) => i)
    // Shuffle the tiles
    const shuffled = shuffleArray(tileArray)
    setTiles(shuffled)
  }

  const shuffleArray = (array: number[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const getGridSize = () => {
    if (!puzzleData) return 3
    return Math.sqrt(puzzleData.pieces)
  }

  const canMove = (index: number) => {
    const gridSize = getGridSize()
    const emptyIndex = tiles.indexOf(0)
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    const emptyRow = Math.floor(emptyIndex / gridSize)
    const emptyCol = emptyIndex % gridSize

    // Check if tile is adjacent to empty space
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    )
  }

  const moveTile = (index: number) => {
    if (!canMove(index) || completed) return

    const newTiles = [...tiles]
    const emptyIndex = tiles.indexOf(0)
    ;[newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]]

    setTiles(newTiles)
    setMoves(moves + 1)

    // Check if puzzle is solved
    const isSolved = newTiles.every((tile, i) => tile === i)
    if (isSolved) {
      handleComplete()
    }
  }

  const resetPuzzle = () => {
    if (puzzleData) {
      initializePuzzle(puzzleData.pieces)
      setMoves(0)
    }
  }

  const handleComplete = async () => {
    if (!game) return

    const completionTime = Math.floor((Date.now() - startTime) / 1000)

    try {
      await apiClient.post(
        `/api/games/${game.id}/complete`,
        {
          score: 100,
          completionTime,
        },
        true
      )
      setCompleted(true)
      setShowSuccess(true)

      toast({
        title: 'مبروك!',
        description: `لقد أكملت اللعبة في ${moves} حركة وربحت ${game.pointsReward} نقطة!`,
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

  if (!game || !puzzleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  const gridSize = getGridSize()
  const colors = [
    'from-red-400 to-pink-500',
    'from-orange-400 to-yellow-500',
    'from-green-400 to-emerald-500',
    'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500',
    'from-indigo-400 to-purple-500',
    'from-teal-400 to-green-500',
    'from-rose-400 to-red-500',
    'from-amber-400 to-orange-500',
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <Link href="/games">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للألعاب
        </Button>
      </Link>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
                aria-label="إغلاق"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Trophy className="h-20 w-20 text-white mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mt-4">
                  رائع!
                </h2>
                <p className="text-xl text-white/90 mt-2">
                  لقد أكملت اللعبة بنجاح
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2">
                    <p className="text-lg font-bold text-white">
                      {moves} حركة
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2">
                    <p className="text-lg font-bold text-white">
                      +{game.pointsReward} نقطة
                    </p>
                  </div>
                </div>
              </div>

              {/* Educational Message */}
              <div className="p-8">
                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                      <Lightbulb className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                        💡 الرسالة التعليمية
                      </h3>
                      <p className="text-lg text-amber-800 dark:text-amber-200 leading-relaxed">
                        {game.educationalMessage}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/games')}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg"
                  size="lg"
                >
                  العودة إلى الألعاب
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20"></div>
        <Card className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{game.title}</CardTitle>
                {!completed && (
                  <p className="text-muted-foreground text-sm">
                    أكمل اللعبة لمعرفة الرسالة التعليمية
                  </p>
                )}
                {completed && (
                  <p className="text-muted-foreground flex items-center gap-2 mt-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    {game.educationalMessage}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="font-bold">{game.pointsReward} نقطة</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-4"
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl">
          <div className="text-sm opacity-90">الحركات</div>
          <div className="text-2xl font-bold">{moves}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl">
          <div className="text-sm opacity-90">القطع</div>
          <div className="text-2xl font-bold">{puzzleData.pieces}</div>
        </div>
      </motion.div>

      {/* Puzzle Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div
              className="grid gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: `${gridSize * 100}px`,
              }}
            >
              {tiles.map((tile, index) => {
                const isEmpty = tile === 0
                const colorIndex = tile % colors.length

                return (
                  <motion.button
                    key={index}
                    onClick={() => moveTile(index)}
                    disabled={isEmpty || completed}
                    whileHover={!isEmpty && !completed ? { scale: 1.05 } : {}}
                    whileTap={!isEmpty && !completed ? { scale: 0.95 } : {}}
                    layout
                    className={`
                      aspect-square rounded-xl text-white font-bold text-2xl
                      transition-all duration-200 relative overflow-hidden
                      ${isEmpty ? 'bg-gray-200 dark:bg-gray-800 cursor-default' : 'cursor-pointer'}
                      ${!isEmpty && canMove(index) && !completed ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                    `}
                  >
                    {!isEmpty && (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors[colorIndex]}`} />
                        <div className="relative z-10 h-full flex items-center justify-center">
                          <span>{tile}</span>
                        </div>
                        {canMove(index) && !completed && (
                          <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-white/20"
                          />
                        )}
                        {completed && (
                          <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </>
                    )}
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={resetPuzzle}
                variant="outline"
                className="flex-1"
                disabled={completed}
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                إعادة البدء
              </Button>
              {completed && (
                <Button
                  onClick={() => router.push('/games')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Trophy className="h-4 w-4 ml-2" />
                  العودة للألعاب
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Completion Message */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="pt-6 text-center space-y-4">
              <Trophy className="h-16 w-16 text-purple-600 mx-auto" />
              <h3 className="text-2xl font-bold">تم إكمال اللعبة!</h3>
              <p className="text-muted-foreground">
                لقد أكملت اللعبة في {moves} حركة
              </p>
              <p className="text-lg font-bold text-purple-600">
                +{game.pointsReward} نقطة
              </p>

              {/* Educational Message */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mt-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      الرسالة التعليمية
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {game.educationalMessage}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      {!completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">كيفية اللعب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• انقر على القطع المجاورة للمربع الفارغ لتحريكها</p>
              <p>• رتب الأرقام من 0 إلى {puzzleData.pieces - 1} بالترتيب</p>
              <p>• القطع المحاطة بحلقة بنفسجية يمكن تحريكها</p>
              <p>• أكمل الترتيب الصحيح لربح النقاط!</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
