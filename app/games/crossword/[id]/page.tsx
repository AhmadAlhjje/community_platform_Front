'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Game, CrosswordData, CrosswordWord } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, CheckCircle, Award, Lightbulb, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function CrosswordPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null)
  const [grid, setGrid] = useState<string[][]>([])
  const [userGrid, setUserGrid] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
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
      setGame(response.data)

      const content: CrosswordData = JSON.parse(response.data.content)
      setCrosswordData(content)

      // Build grid from words
      const builtGrid = buildGrid(content.words)
      setGrid(builtGrid)
      setUserGrid(builtGrid.map(row => row.map(cell => cell === '#' ? '#' : '')))
    } catch (error) {
      console.error(error)
    }
  }

  const buildGrid = (words: CrosswordWord[]): string[][] => {
    // Find grid dimensions
    let maxRow = 0
    let maxCol = 0

    words.forEach(word => {
      if (word.direction === 'across') {
        maxRow = Math.max(maxRow, word.position.row)
        maxCol = Math.max(maxCol, word.position.col + word.answer.length - 1)
      } else {
        maxRow = Math.max(maxRow, word.position.row + word.answer.length - 1)
        maxCol = Math.max(maxCol, word.position.col)
      }
    })

    // Initialize grid with blocked cells
    const grid: string[][] = Array(maxRow + 1).fill(null).map(() =>
      Array(maxCol + 1).fill('#')
    )

    // Fill in the words
    words.forEach(word => {
      const letters = word.answer.split('')
      if (word.direction === 'across') {
        letters.forEach((letter, i) => {
          grid[word.position.row][word.position.col + i] = letter
        })
      } else {
        letters.forEach((letter, i) => {
          grid[word.position.row + i][word.position.col] = letter
        })
      }
    })

    return grid
  }

  const getWordNumberForCell = (row: number, col: number): number | null => {
    if (!crosswordData) return null

    // Find if this cell is the start of any word
    const word = crosswordData.words.find(w =>
      w.position.row === row && w.position.col === col
    )

    return word ? word.number : null
  }

  const handleCellChange = (row: number, col: number, value: string) => {
    if (grid[row][col] === '#' || completed) return

    const arabicOnly = value.replace(/[^ء-ي]/g, '')
    const newGrid = [...userGrid]
    newGrid[row][col] = arabicOnly.slice(-1)
    setUserGrid(newGrid)

    // Auto-move to next cell
    if (arabicOnly) {
      // Try to move right first
      if (col < grid[row].length - 1 && grid[row][col + 1] !== '#') {
        setSelectedCell({ row, col: col + 1 })
      }
      // Try to move down
      else if (row < grid.length - 1 && grid[row + 1][col] !== '#') {
        setSelectedCell({ row: row + 1, col })
      }
    }
  }

  const handleCheckAnswers = () => {
    if (!grid) return

    let correct = 0
    let total = 0

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== '#') {
          total++
          if (userGrid[i][j] && userGrid[i][j].toLowerCase() === grid[i][j].toLowerCase()) {
            correct++
          }
        }
      }
    }

    const percentage = Math.round((correct / total) * 100)

    if (percentage === 100) {
      handleComplete()
    } else {
      toast({
        title: `${percentage}% صحيح`,
        description: `${correct} من ${total} خانة صحيحة. حاول مرة أخرى!`,
        variant: percentage >= 70 ? 'default' : 'destructive',
      })
    }
  }

  const handleReset = () => {
    setUserGrid(grid.map(row => row.map(cell => cell === '#' ? '#' : '')))
    setSelectedCell(null)
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
        description: `لقد أكملت اللعبة وربحت ${game.pointsReward} نقطة!`,
        variant: 'success',
      })

      setTimeout(() => router.push('/games'), 3000)
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (!game || !crosswordData || grid.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-500 p-12 rounded-3xl shadow-2xl"
            >
              <Trophy className="h-24 w-24 text-white mx-auto" />
              <h2 className="text-3xl font-bold text-white text-center mt-4">
                أحسنت!
              </h2>
              <p className="text-white/90 text-center mt-2">
                +{game.pointsReward} نقطة
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{game.title}</CardTitle>
              <p className="text-muted-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                {game.educationalMessage}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full">
              <Award className="h-4 w-4" />
              <span className="font-bold">{game.pointsReward} نقطة</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        {/* Crossword Grid */}
        <Card>
          <CardHeader>
            <CardTitle>الشبكة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-block bg-white dark:bg-gray-900 p-4 rounded-lg">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => {
                    const isBlocked = cell === '#'
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    const userValue = userGrid[rowIndex]?.[colIndex] || ''
                    const isCorrect = userValue && userValue.toLowerCase() === cell.toLowerCase()
                    const wordNumber = getWordNumberForCell(rowIndex, colIndex)

                    return (
                      <div
                        key={colIndex}
                        className="relative"
                      >
                        <input
                          type="text"
                          value={isBlocked ? '' : userValue}
                          onChange={(e) => !isBlocked && handleCellChange(rowIndex, colIndex, e.target.value)}
                          onFocus={() => !isBlocked && setSelectedCell({ row: rowIndex, col: colIndex })}
                          disabled={isBlocked || completed}
                          maxLength={1}
                          className={`
                            w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold border-2 uppercase
                            transition-all duration-200
                            ${isBlocked
                              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed border-gray-400 dark:border-gray-600'
                              : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600'
                            }
                            ${isSelected && !isBlocked ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700 z-10' : ''}
                            ${isCorrect && completed ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' : ''}
                            ${!isBlocked && !completed ? 'hover:border-blue-400 focus:outline-none' : ''}
                          `}
                        />
                        {wordNumber && (
                          <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 pointer-events-none">
                            {wordNumber}
                          </span>
                        )}
                        {isCorrect && completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          >
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                onClick={handleCheckAnswers}
                disabled={completed}
              >
                <CheckCircle className="h-4 w-4 ml-2" />
                تحقق من الإجابات
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={completed}
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                إعادة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clues */}
        <div className="space-y-4">
          {/* Across Clues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">أفقي →</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crosswordData.words
                  .filter(word => word.direction === 'across')
                  .sort((a, b) => a.number - b.number)
                  .map((word, index) => (
                    <motion.div
                      key={word.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
                    >
                      <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {word.number}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{word.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ({word.answer.length} أحرف)
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Down Clues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">عمودي ↓</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crosswordData.words
                  .filter(word => word.direction === 'down')
                  .sort((a, b) => a.number - b.number)
                  .map((word, index) => (
                    <motion.div
                      key={word.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800"
                    >
                      <span className="bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {word.number}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{word.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ({word.answer.length} أحرف)
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion Message */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6 text-center">
              <Trophy className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">تم إكمال اللعبة!</h3>
              <p className="text-muted-foreground">
                لقد حللت جميع الكلمات بنجاح
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">
                +{game.pointsReward} نقطة
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
