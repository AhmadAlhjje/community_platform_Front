'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Game } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, Lightbulb, RotateCcw, X, Volume2, VolumeX, Check } from 'lucide-react'
import Link from 'next/link'

interface PuzzleData {
  pieces: number
  imageUrl?: string
  difficulty: string
  description?: string
}

interface PuzzlePiece {
  id: number
  correctX: number
  correctY: number
  image: string
}

interface PlacedPiece {
  pieceId: number
  slotId: number
}

export default function PuzzlePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [slots, setSlots] = useState<number[]>([]) // سيحتوي على معرفات القطع المعروضة
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [checking, setChecking] = useState(false)
  const [startTime] = useState(Date.now())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [gridCols, setGridCols] = useState(3)
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchGame()
  }, [params.id])

  useEffect(() => {
    if (puzzleData && pieces.length === 0) {
      generatePuzzlePieces()
    }
  }, [puzzleData?.imageUrl])

  const playSound = (type: 'click' | 'success' | 'error') => {
    if (!soundEnabled) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    if (type === 'click') {
      oscillator.frequency.value = 600
      gain.gain.setValueAtTime(0.1, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } else if (type === 'error') {
      oscillator.frequency.value = 300
      gain.gain.setValueAtTime(0.1, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } else if (type === 'success') {
      oscillator.frequency.value = 1000
      gain.gain.setValueAtTime(0.1, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

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

      let content: PuzzleData | null = null
      try {
        let parsed = JSON.parse(response.data.content)
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed)
        }
        content = parsed
      } catch (parseError) {
        console.error('Error parsing content:', parseError)
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في تحميل بيانات اللعبة',
          variant: 'destructive',
        })
        return
      }

      if (!content || typeof content.pieces !== 'number' || !content.imageUrl) {
        toast({
          title: 'خطأ',
          description: 'بيانات اللعبة غير صحيحة',
          variant: 'destructive',
        })
        return
      }

      let imageUrl = content.imageUrl
      if (imageUrl && !imageUrl.startsWith('http')) {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'
        imageUrl = apiBaseUrl + imageUrl
      }

      setPuzzleData({ ...content, imageUrl })

      // حساب عدد الأعمدة بناءً على عدد القطع
      const cols = Math.ceil(Math.sqrt(content.pieces))
      setGridCols(cols)

      // إنشاء فتحات فارغة
      setSlots(Array(content.pieces).fill(null))
    } catch (error) {
      console.error('Error fetching game:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل اللعبة',
        variant: 'destructive',
      })
    }
  }

  const generatePuzzlePieces = async () => {
    if (!puzzleData?.imageUrl) {
      console.error('No image URL available')
      return
    }

    return new Promise<void>((resolve) => {
      try {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.referrerPolicy = 'no-referrer'

        img.onload = () => {
          try {
            const cols = Math.ceil(Math.sqrt(puzzleData.pieces))
            const rows = Math.ceil(puzzleData.pieces / cols)
            const pieceWidth = img.width / cols
            const pieceHeight = img.height / rows

            const newPieces: PuzzlePiece[] = []
            let pieceId = 0

            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                if (pieceId >= puzzleData.pieces) break

                const pieceCanvas = document.createElement('canvas')
                pieceCanvas.width = Math.floor(pieceWidth)
                pieceCanvas.height = Math.floor(pieceHeight)

                const pieceCtx = pieceCanvas.getContext('2d')
                if (!pieceCtx) continue

                pieceCtx.drawImage(
                  img,
                  Math.floor(col * pieceWidth),
                  Math.floor(row * pieceHeight),
                  Math.floor(pieceWidth),
                  Math.floor(pieceHeight),
                  0,
                  0,
                  Math.floor(pieceWidth),
                  Math.floor(pieceHeight)
                )

                newPieces.push({
                  id: pieceId,
                  correctX: col,
                  correctY: row,
                  image: pieceCanvas.toDataURL('image/png'),
                })

                pieceId++
              }
            }

            // تعشيش القطع
            const shuffled = newPieces.sort(() => Math.random() - 0.5)
            setPieces(shuffled)
            console.log(`Generated ${shuffled.length} puzzle pieces`)
            resolve()
          } catch (error) {
            console.error('Error creating puzzle pieces:', error)
            toast({
              title: 'خطأ',
              description: 'فشل في تقطيع الصورة',
              variant: 'destructive',
            })
            resolve()
          }
        }

        img.onerror = () => {
          console.error('Image load error, URL:', puzzleData.imageUrl)
          toast({
            title: 'خطأ في تحميل الصورة',
            description: 'فشل تحميل الصورة',
            variant: 'destructive',
          })
          resolve()
        }

        console.log('Loading image from:', puzzleData.imageUrl)
        if (puzzleData.imageUrl) {
          img.src = puzzleData.imageUrl
        }
      } catch (error) {
        console.error('Error in generatePuzzlePieces:', error)
        resolve()
      }
    })
  }

  const handlePieceClick = (pieceId: number) => {
    if (placedPieces.some(p => p.pieceId === pieceId)) return
    playSound('click')
    setSelectedPiece(selectedPiece === pieceId ? null : pieceId)
  }

  const handleSlotClick = (slotIndex: number) => {
    if (selectedPiece === null) {
      toast({
        title: 'اختر قطعة أولاً',
        description: 'يجب أن تختار قطعة من أسفل قبل النقر على مكان',
        variant: 'destructive',
      })
      return
    }

    // تحقق من أن هذا المكان فارغ
    if (placedPieces.some(p => p.slotId === slotIndex)) {
      toast({
        title: 'هذا المكان مشغول',
        description: 'اختر مكاناً فارغاً',
        variant: 'destructive',
      })
      return
    }

    playSound('click')
    setPlacedPieces([...placedPieces, { pieceId: selectedPiece, slotId: slotIndex }])
    setSelectedPiece(null)
    setMoves(moves + 1)
  }

  const handleUndo = (slotIndex: number) => {
    setPlacedPieces(placedPieces.filter(p => p.slotId !== slotIndex))
    setMoves(Math.max(0, moves - 1))
  }

  const checkSolution = async () => {
    if (placedPieces.length !== puzzleData?.pieces) {
      toast({
        title: 'لم تكمل اللعبة',
        description: `أكمل جميع القطع (${placedPieces.length}/${puzzleData?.pieces})`,
        variant: 'destructive',
      })
      playSound('error')
      return
    }

    setChecking(true)

    // التحقق من صحة الحل
    let isCorrect = true
    for (const placed of placedPieces) {
      const piece = pieces.find(p => p.id === placed.pieceId)
      const expectedSlotId = piece!.correctY * gridCols + piece!.correctX

      if (expectedSlotId !== placed.slotId) {
        isCorrect = false
        break
      }
    }

    if (!isCorrect) {
      playSound('error')
      toast({
        title: 'الحل غير صحيح',
        description: 'بعض القطع في أماكن خاطئة. حاول مرة أخرى!',
        variant: 'destructive',
      })
      setChecking(false)
      return
    }

    // الحل صحيح!
    playSound('success')
    const completionTime = Math.floor((Date.now() - startTime) / 1000)

    try {
      await apiClient.post(
        `/api/games/${game!.id}/complete`,
        {
          score: 100,
          completionTime,
        },
        true
      )

      setShowSuccess(true)
      toast({
        title: 'مبروك!',
        description: `لقد أكملت اللعبة في ${moves} حركة وربحت ${game!.pointsReward} نقطة!`,
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setChecking(false)
    }
  }

  const resetGame = () => {
    setPlacedPieces([])
    setSelectedPiece(null)
    setMoves(0)
    setPieces([...pieces].sort(() => Math.random() - 0.5))
  }

  if (!game || !puzzleData || pieces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  const getPlacedPieceAtSlot = (slotIndex: number) => {
    const placed = placedPieces.find(p => p.slotId === slotIndex)
    return placed ? pieces.find(p => p.id === placed.pieceId) : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <Link href="/games">
          <Button variant="ghost" size="sm" className="hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للألعاب
          </Button>
        </Link>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="absolute top-4 right-4 z-10 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="h-6 w-6 text-gray-700 dark:text-white" />
                </button>

                <div className="relative z-10 p-8 text-center space-y-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 8, -8, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <Trophy className="h-14 w-14 text-white" />
                    </div>
                  </motion.div>

                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                    >
                      رائع جداً!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600 dark:text-gray-300 text-lg"
                    >
                      لقد حللت اللغز بنجاح
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">الحركات</div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{moves}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">النقاط</div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">+{game.pointsReward}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg flex-shrink-0">
                        <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1 uppercase">
                          الرسالة التعليمية
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                          {game.educationalMessage}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      onClick={() => router.push('/games')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
                      size="lg"
                    >
                      العودة إلى الألعاب
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {game.title}
                  </CardTitle>
                  {puzzleData.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {puzzleData.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-xl font-bold whitespace-nowrap">
                  <Trophy className="h-5 w-5" />
                  <span>{game.pointsReward} نقطة</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Puzzle Grid - Left/Top */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>مربعات اللغز</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {placedPieces.length}/{puzzleData.pieces}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    >
                      {soundEnabled ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div
                  className="mx-auto mb-6 sm:mb-8 bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gap: '0px',
                    maxWidth: '100%',
                    width: 'min(100%, 600px)',
                    aspectRatio: '1 / 1',
                  }}
                >
                  {slots.map((_, slotIndex) => {
                    const placedPiece = getPlacedPieceAtSlot(slotIndex)

                    return (
                      <button
                        key={slotIndex}
                        onClick={() => handleSlotClick(slotIndex)}
                        className={`relative w-full h-full overflow-hidden border border-gray-300 dark:border-gray-700 ${
                          placedPiece
                            ? 'bg-white dark:bg-gray-800'
                            : selectedPiece !== null
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={{ aspectRatio: '1 / 1' }}
                      >
                        {placedPiece ? (
                          <>
                            <img
                              src={placedPiece.image}
                              alt="puzzle piece"
                              className="w-full h-full object-cover"
                            />
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUndo(slotIndex)
                              }}
                              className="absolute inset-0 bg-red-500/0 hover:bg-red-500/80 flex flex-col items-center justify-center text-white font-bold cursor-pointer transition-all opacity-0 hover:opacity-100"
                            >
                              <X className="h-6 w-6 mb-1" />
                              <span className="text-xs">إزالة</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-2xl text-gray-300 dark:text-gray-600">
                            {selectedPiece !== null ? '+' : ''}
                          </div>
                        )}
                        <div className="absolute bottom-0.5 right-0.5 bg-white/70 dark:bg-gray-800/70 px-1.5 py-0.5 text-[9px] font-semibold text-gray-500 dark:text-gray-400">
                          {slotIndex + 1}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="flex-1 border-2"
                  >
                    <RotateCcw className="h-4 w-4 ml-2" />
                    إعادة
                  </Button>
                  <Button
                    onClick={checkSolution}
                    disabled={placedPieces.length !== puzzleData.pieces || checking}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Check className="h-4 w-4 ml-2" />
                    {checking ? 'جاري التحقق...' : 'تحقق من الحل'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pieces Panel - Right/Bottom */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg lg:sticky lg:top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>قطع اللغز</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {pieces.filter(p => !placedPieces.some(pp => pp.pieceId === p.id)).length} متبقية
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700 scrollbar-track-transparent">
                  {pieces.map((piece) => {
                    const isPlaced = placedPieces.some(p => p.pieceId === piece.id)
                    const isSelected = selectedPiece === piece.id

                    return (
                      <motion.button
                        key={piece.id}
                        whileHover={{ scale: isPlaced ? 1 : 1.05 }}
                        whileTap={{ scale: isPlaced ? 1 : 0.95 }}
                        onClick={() => handlePieceClick(piece.id)}
                        disabled={isPlaced}
                        className={`relative aspect-square overflow-hidden border-2 transition-all shadow-md ${
                          isSelected
                            ? 'ring-4 ring-purple-500 ring-offset-2 border-purple-500 scale-105 shadow-xl'
                            : isPlaced
                            ? 'opacity-30 cursor-not-allowed border-gray-300 grayscale'
                            : 'border-gray-300 hover:border-purple-400 hover:shadow-lg'
                        }`}
                      >
                        <img
                          src={piece.image}
                          alt={`piece ${piece.id}`}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && !isPlaced && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center"
                          >
                            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                              محدد
                            </div>
                          </motion.div>
                        )}
                        {isPlaced && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                            ✓ مستخدم
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6"
        >
          <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            كيفية اللعب
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✓ اختر قطعة من الجانب الأيمن</li>
            <li>✓ انقر على مكان فارغ في الشبكة اليسرى لوضعها</li>
            <li>✓ استخدم زر "إزالة" لحذف قطعة من مكانها</li>
            <li>✓ عندما تنتهي، انقر على "تحقق من الحل"</li>
            <li>✓ إذا كانت جميع القطع في أماكنها الصحيحة ستفوز!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
