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
import { ArrowLeft, Trophy, CheckCircle, Award, Lightbulb, RotateCcw, X } from 'lucide-react'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function CrosswordPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null)
  const [grid, setGrid] = useState<string[][]>([])
  const [userGrid, setUserGrid] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [startTime] = useState(Date.now())
  const [helperLetters, setHelperLetters] = useState<{ [key: number]: string[] }>({})
  const [usedLetters, setUsedLetters] = useState<{ [key: number]: string[] }>({})
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchGame()
  }, [params.id])

  const fetchGame = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Game }>(`/api/games/${params.id}`)

      if (!response.success || !response.data) {
        toast({
          title: 'خطأ',
          description: 'لم يتم العثور على اللعبة',
          variant: 'destructive',
        })
        router.push('/games')
        return
      }

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

      // Parse the content - it comes as a JSON string that might be double-encoded
      let content: CrosswordData | null = null
      try {
        // Check if content is already an object
        if (typeof response.data.content === 'object' && response.data.content !== null) {
          content = response.data.content
        } else if (typeof response.data.content === 'string') {
          // First parse attempt
          let parsed = JSON.parse(response.data.content)

          // If it's a string (double-encoded), parse again
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed)
          }

          content = parsed
        } else {
          throw new Error('Invalid content format')
        }
      } catch (parseError) {
        console.error('Error parsing content:', parseError)
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في تحميل بيانات اللعبة',
          variant: 'destructive',
        })
        return
      }

      if (!content) {
        toast({
          title: 'خطأ',
          description: 'بيانات اللعبة غير صحيحة',
          variant: 'destructive',
        })
        return
      }

      // Handle both old and new API formats
      let processedContent: CrosswordData = content

      // If we have grid and clues (new format), convert to words format for compatibility
      if (content.grid && content.clues && !content.words) {
        const grid = content.grid
        const clues = content.clues
        // Build words array from grid and clues
        const words: CrosswordWord[] = []
        let wordNumber = 1

        // Process across clues
        if (clues.across) {
          clues.across.forEach((clue) => {
            // Find the position in grid
            let found = false
            for (let row = 0; row < grid.length && !found; row++) {
              for (let col = 0; col < grid[row].length && !found; col++) {
                if (grid[row][col] !== '') {
                  // Calculate answer from grid
                  let answer = ''
                  for (let c = col; c < grid[row].length && grid[row][c] !== ''; c++) {
                    answer += grid[row][c]
                  }
                  if (answer.length > 1) {
                    words.push({
                      number: wordNumber,
                      direction: 'across',
                      question: clue,
                      answer: answer,
                      position: { row, col }
                    })
                    found = true
                    wordNumber++
                  }
                }
              }
            }
          })
        }

        // Process down clues
        if (clues.down) {
          clues.down.forEach((clue) => {
            // Find the position in grid
            let found = false
            for (let row = 0; row < grid.length && !found; row++) {
              for (let col = 0; col < grid[row].length && !found; col++) {
                if (grid[row][col] !== '') {
                  // Calculate answer from grid
                  let answer = ''
                  for (let r = row; r < grid.length && grid[r][col] !== ''; r++) {
                    answer += grid[r][col]
                  }
                  if (answer.length > 1) {
                    const existsAcross = words.some(w => w.position.row === row && w.position.col === col)
                    if (!existsAcross) {
                      words.push({
                        number: wordNumber,
                        direction: 'down',
                        question: clue,
                        answer: answer,
                        position: { row, col }
                      })
                      wordNumber++
                      found = true
                    }
                  }
                }
              }
            }
          })
        }

        processedContent = { words }
      }

      if (!processedContent.words || !Array.isArray(processedContent.words)) {
        toast({
          title: 'خطأ',
          description: 'بيانات اللعبة غير صحيحة',
          variant: 'destructive',
        })
        return
      }

      setCrosswordData(processedContent)

      // Build grid from words
      const builtGrid = buildGrid(processedContent.words)
      setGrid(builtGrid)
      setUserGrid(builtGrid.map(row => row.map(cell => cell === '#' ? '#' : '')))

      // Generate helper letters for each word
      const helpers = generateHelperLetters(processedContent.words)
      setHelperLetters(helpers)
    } catch (error) {
      console.error('Error fetching game:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل اللعبة',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
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

  const generateHelperLetters = (words: CrosswordWord[]): { [key: number]: string[] } => {
    const helpers: { [key: number]: string[] } = {}

    // أحرف عربية إضافية للاختيار منها
    const arabicLetters = [
      'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ',
      'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ة', 'ى', 'ء'
    ]

    words.forEach(word => {
      // أحرف الإجابة
      const answerLetters = word.answer.split('')

      // عدد الأحرف الإضافية المطلوبة
      const extraLettersNeeded = Math.max(0, 12 - answerLetters.length)

      // أحرف إضافية عشوائية
      const extraLetters: string[] = []
      for (let i = 0; i < extraLettersNeeded; i++) {
        const randomLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)]
        extraLetters.push(randomLetter)
      }

      // دمج أحرف الإجابة مع الأحرف الإضافية وخلطها
      const allLetters = [...answerLetters, ...extraLetters]
      const shuffledLetters = allLetters.sort(() => Math.random() - 0.5)

      helpers[word.number] = shuffledLetters
    })

    return helpers
  }

  const getWordNumbersForCell = (row: number, col: number): { across: number | null; down: number | null } => {
    if (!crosswordData || !crosswordData.words) return { across: null, down: null }

    // Find words that start at this cell
    const acrossWord = crosswordData.words.find(w =>
      w.position.row === row && w.position.col === col && w.direction === 'across'
    )

    const downWord = crosswordData.words.find(w =>
      w.position.row === row && w.position.col === col && w.direction === 'down'
    )

    return {
      across: acrossWord ? acrossWord.number : null,
      down: downWord ? downWord.number : null
    }
  }

  const handleCellClear = (row: number, col: number) => {
    if (grid[row][col] === '#' || completed) return

    const oldValue = userGrid[row][col]

    // If there's a letter in the cell, remove it
    if (oldValue) {
      // Find which word this cell belongs to
      if (crosswordData?.words) {
        const word = crosswordData.words.find(w => {
          if (w.direction === 'across') {
            return w.position.row === row &&
                   col >= w.position.col &&
                   col < w.position.col + w.answer.length
          } else {
            return w.position.col === col &&
                   row >= w.position.row &&
                   row < w.position.row + w.answer.length
          }
        })

        if (word) {
          // Remove letter from used letters
          setUsedLetters(prev => {
            const used = prev[word.number] || []
            const letterIndex = used.indexOf(oldValue)
            if (letterIndex > -1) {
              const newUsed = [...used]
              newUsed.splice(letterIndex, 1)
              return {
                ...prev,
                [word.number]: newUsed
              }
            }
            return prev
          })
        }
      }

      // Clear the cell
      const newGrid = [...userGrid]
      newGrid[row][col] = ''
      setUserGrid(newGrid)
    }
  }

  const handleLetterClick = (letter: string, wordNumber: number) => {
    if (!selectedCell || completed) return

    const row = selectedCell.row
    const col = selectedCell.col

    if (grid[row][col] === '#') return

    // Check if the selected cell belongs to the word that this letter is for
    if (!crosswordData?.words) return

    const selectedCellWord = crosswordData.words.find(w => {
      if (w.direction === 'across') {
        return w.position.row === row &&
               col >= w.position.col &&
               col < w.position.col + w.answer.length
      } else {
        return w.position.col === col &&
               row >= w.position.row &&
               row < w.position.row + w.answer.length
      }
    })

    // If the selected cell doesn't belong to this word's clue, show error
    if (!selectedCellWord || selectedCellWord.number !== wordNumber) {
      toast({
        title: 'تنبيه',
        description: 'يجب اختيار خانة من نفس الكلمة',
        variant: 'destructive',
      })
      return
    }

    // First, clear the current cell if it has a letter
    const oldValue = userGrid[row][col]
    if (oldValue) {
      handleCellClear(row, col)
    }

    const newGrid = [...userGrid]
    newGrid[row][col] = letter
    setUserGrid(newGrid)

    // Mark letter as used for this word
    setUsedLetters(prev => ({
      ...prev,
      [wordNumber]: [...(prev[wordNumber] || []), letter]
    }))

    // Auto-move to next empty cell
    setTimeout(() => {
      moveToNextEmptyCell(row, col)
    }, 0)
  }

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col] === '#' || completed) return

    // If clicking on an already selected cell with a letter, clear it
    if (selectedCell?.row === row && selectedCell?.col === col && userGrid[row][col]) {
      handleCellClear(row, col)
      return
    }

    setSelectedCell({ row, col })

    // Find which word this cell belongs to
    if (!crosswordData?.words) return

    const word = crosswordData.words.find(w => {
      if (w.direction === 'across') {
        return w.position.row === row &&
               col >= w.position.col &&
               col < w.position.col + w.answer.length
      } else {
        return w.position.col === col &&
               row >= w.position.row &&
               row < w.position.row + w.answer.length
      }
    })

    if (word) {
      setSelectedWord(word.number)
    }
  }

  const moveToNextEmptyCell = (currentRow: number, currentCol: number) => {
    if (!crosswordData?.words || !selectedWord) return

    // Find the current word
    const currentWord = crosswordData.words.find(w => w.number === selectedWord)
    if (!currentWord) return

    // Find next empty cell in the same word
    if (currentWord.direction === 'across') {
      // Move horizontally within the word
      for (let col = currentCol + 1; col < currentWord.position.col + currentWord.answer.length; col++) {
        if (!userGrid[currentRow][col]) {
          setSelectedCell({ row: currentRow, col })
          return
        }
      }
    } else {
      // Move vertically within the word
      for (let row = currentRow + 1; row < currentWord.position.row + currentWord.answer.length; row++) {
        if (!userGrid[row][currentCol]) {
          setSelectedCell({ row, col: currentCol })
          return
        }
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
    setUsedLetters({})
  }

  const isLetterUsed = (letter: string, wordNumber: number, index: number): boolean => {
    const allLetters = helperLetters[wordNumber] || []
    const used = usedLetters[wordNumber] || []

    // Count how many times this letter appears before this index
    let countBefore = 0
    for (let i = 0; i < index; i++) {
      if (allLetters[i] === letter) {
        countBefore++
      }
    }

    // Count how many times this letter has been used
    const usedCount = used.filter(u => u === letter).length

    // This specific instance is used if we've used more letters than appear before it
    return usedCount > countBefore
  }

  const handleComplete = async () => {
    if (!game || completing) return

    setCompleting(true)
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
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCompleting(false)
    }
  }

  if (loading || !game || !crosswordData || grid.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <LoadingSpinner size="lg" />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative border-4 border-green-500"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 left-4 z-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
                aria-label="إغلاق"
              >
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </button>

              {/* Header */}
              <div className="bg-green-500 p-8 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Trophy className="h-20 w-20 text-white mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mt-4">
                  أحسنت!
                </h2>
                <p className="text-xl text-white mt-2">
                  لقد أكملت اللعبة بنجاح
                </p>
                <div className="bg-white rounded-xl px-6 py-3 inline-block mt-4">
                  <p className="text-2xl font-bold text-green-600">
                    +{game.pointsReward} نقطة
                  </p>
                </div>
              </div>

              {/* Educational Message */}
              <div className="p-8">
                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-700 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-400 p-3 rounded-xl">
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                        الرسالة التعليمية
                      </h3>
                      <p className="text-lg text-amber-900 dark:text-amber-200 leading-relaxed">
                        {game.educationalMessage}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/games')}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-md"
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
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-blue-50 dark:bg-blue-950/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-3 text-blue-900 dark:text-blue-100">{game.title}</CardTitle>
              {!completed && (
                <p className="text-gray-700 dark:text-gray-300 text-base">
                  أكمل جميع الكلمات لمعرفة الرسالة التعليمية
                </p>
              )}
              {completed && (
                <div className="flex items-center gap-2 mt-2 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg border-2 border-amber-400 dark:border-amber-700">
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-amber-900 dark:text-amber-200 font-medium">
                    {game.educationalMessage}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md">
              <Award className="h-5 w-5" />
              <span className="font-bold text-lg">{game.pointsReward} نقطة</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        {/* Crossword Grid */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/50">
            <CardTitle className="text-xl text-blue-900 dark:text-blue-100">الشبكة</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Scrollable container for mobile responsiveness */}
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-xl border-2 border-gray-200 dark:border-gray-700">
              <div className="inline-block bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-6 min-w-min">
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => {
                      const isBlocked = cell === '#'
                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      const userValue = userGrid[rowIndex]?.[colIndex] || ''
                      const isCorrect = userValue && userValue.toLowerCase() === cell.toLowerCase()
                      const wordNumbers = getWordNumbersForCell(rowIndex, colIndex)

                      return (
                        <div
                          key={colIndex}
                          className="relative"
                        >
                          <input
                            type="text"
                            value={isBlocked ? '' : userValue}
                            readOnly
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onFocus={() => !isBlocked && setSelectedCell({ row: rowIndex, col: colIndex })}
                            disabled={isBlocked || completed}
                            data-row={rowIndex}
                            data-col={colIndex}
                            className={`
                              w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base sm:text-xl md:text-2xl font-bold border-2
                              transition-all duration-200 rounded-sm
                              ${isBlocked
                                ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed border-gray-300 dark:border-gray-700'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-pointer'
                              }
                              ${isSelected && !isBlocked ? 'border-blue-500 ring-2 sm:ring-4 ring-blue-200 dark:ring-blue-900 z-10 scale-105 shadow-lg' : ''}
                              ${isCorrect && completed ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' : ''}
                              ${!isBlocked && !completed && !isSelected ? 'hover:border-blue-300 hover:shadow-md hover:scale-102' : ''}
                              focus:outline-none
                            `}
                          />
                          {/* Across number - top left */}
                          {wordNumbers.across && (
                            <span
                              className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-[9px] sm:text-xs font-bold px-0.5 sm:px-1 rounded bg-blue-600 text-white pointer-events-none"
                              style={{ lineHeight: '1.2' }}
                            >
                              {wordNumbers.across}
                            </span>
                          )}
                          {/* Down number - bottom left */}
                          {wordNumbers.down && (
                            <span
                              className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 text-[9px] sm:text-xs font-bold px-0.5 sm:px-1 rounded bg-indigo-600 text-white pointer-events-none"
                              style={{ lineHeight: '1.2' }}
                            >
                              {wordNumbers.down}
                            </span>
                          )}
                          {isCorrect && completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                              <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                            </motion.div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Hint for mobile users */}
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 text-center">
              يمكنك التمرير أفقياً وعمودياً لرؤية الشبكة بالكامل
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                onClick={handleCheckAnswers}
                disabled={completed}
                size="lg"
              >
                <CheckCircle className="h-5 w-5 ml-2" />
                تحقق من الإجابات
              </Button>
              <Button
                variant="outline"
                className="border-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleReset}
                disabled={completed}
                size="lg"
              >
                <RotateCcw className="h-5 w-5 ml-2" />
                إعادة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clues */}
        <div className="space-y-4">
          {/* Across Clues */}
          <Card className="border-2">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">→</span>
                أفقي
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {crosswordData?.words
                  ?.filter(word => word.direction === 'across')
                  ?.sort((a, b) => a.number - b.number)
                  ?.map((word, index) => (
                    <motion.div
                      key={word.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedWord === word.number
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 shadow-md'
                          : 'bg-white dark:bg-gray-800/50 border-blue-200 dark:border-blue-900'
                      }`}
                    >
                      <div className="flex gap-3 mb-3">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                          {word.number}
                        </span>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{word.question}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {word.answer.length} أحرف
                          </p>
                        </div>
                      </div>
                      {/* Helper Letters */}
                      {helperLetters[word.number] && (
                        <div className="pt-3 border-t-2 border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {selectedWord === word.number ? 'اضغط على الحرف لإضافته:' : 'الأحرف المساعدة:'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {helperLetters[word.number].map((letter, idx) => {
                              const isUsed = isLetterUsed(letter, word.number, idx)
                              return (
                                <motion.button
                                  key={`${letter}-${idx}`}
                                  onClick={() => !isUsed && handleLetterClick(letter, word.number)}
                                  disabled={completed || isUsed}
                                  whileHover={!isUsed ? { scale: 1.1 } : {}}
                                  whileTap={!isUsed ? { scale: 0.95 } : {}}
                                  className={`w-10 h-10 text-lg font-bold rounded-lg shadow-md transition-all ${
                                    isUsed
                                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed line-through'
                                      : selectedWord === word.number
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:bg-blue-800 cursor-pointer'
                                        : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/60 cursor-pointer'
                                  }`}
                                >
                                  {letter}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Down Clues */}
          <Card className="border-2">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-950/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400">↓</span>
                عمودي
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {crosswordData?.words
                  ?.filter(word => word.direction === 'down')
                  ?.sort((a, b) => a.number - b.number)
                  ?.map((word, index) => (
                    <motion.div
                      key={word.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedWord === word.number
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 shadow-md'
                          : 'bg-white dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-900'
                      }`}
                    >
                      <div className="flex gap-3 mb-3">
                        <span className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                          {word.number}
                        </span>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{word.question}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {word.answer.length} أحرف
                          </p>
                        </div>
                      </div>
                      {/* Helper Letters */}
                      {helperLetters[word.number] && (
                        <div className="pt-3 border-t-2 border-indigo-200 dark:border-indigo-800">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {selectedWord === word.number ? 'اضغط على الحرف لإضافته:' : 'الأحرف المساعدة:'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {helperLetters[word.number].map((letter, idx) => {
                              const isUsed = isLetterUsed(letter, word.number, idx)
                              return (
                                <motion.button
                                  key={`${letter}-${idx}`}
                                  onClick={() => !isUsed && handleLetterClick(letter, word.number)}
                                  disabled={completed || isUsed}
                                  whileHover={!isUsed ? { scale: 1.1 } : {}}
                                  whileTap={!isUsed ? { scale: 0.95 } : {}}
                                  className={`w-10 h-10 text-lg font-bold rounded-lg shadow-md transition-all ${
                                    isUsed
                                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed line-through'
                                      : selectedWord === word.number
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg active:bg-indigo-800 cursor-pointer'
                                        : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 cursor-pointer'
                                  }`}
                                >
                                  {letter}
                                </motion.button>
                              )
                            })}
                          </div>
                        </div>
                      )}
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
          <Card className="border-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6 text-center space-y-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Trophy className="h-20 w-20 text-green-600 mx-auto" />
              </motion.div>
              <h3 className="text-3xl font-bold text-green-700 dark:text-green-500">تم إكمال اللعبة!</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                لقد حللت جميع الكلمات بنجاح
              </p>
              <div className="bg-green-600 text-white px-6 py-3 rounded-xl inline-block">
                <p className="text-2xl font-bold">
                  +{game.pointsReward} نقطة
                </p>
              </div>

              {/* Educational Message */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-700 p-6 rounded-xl mt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400 p-3 rounded-xl">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                      الرسالة التعليمية
                    </p>
                    <p className="text-base text-amber-900 dark:text-amber-200 leading-relaxed">
                      {game.educationalMessage}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
