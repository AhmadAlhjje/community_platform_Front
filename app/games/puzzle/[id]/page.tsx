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
  correctSlotId: number
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
  const [slots, setSlots] = useState<number[]>([])
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [checking, setChecking] = useState(false)
  const [startTime] = useState(Date.now())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [gridCols, setGridCols] = useState(3)
  const [debugMode, setDebugMode] = useState(false)
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setDebugMode(prev => {
          const newMode = !prev
          console.log(`🔧 وضع التشخيص: ${newMode ? 'مفعّل' : 'معطّل'}`)
          return newMode
        })
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

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

      const cols = Math.ceil(Math.sqrt(content.pieces))
      setGridCols(cols)

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

            const CANVAS_SIZE = 600
            const pieceWidth = CANVAS_SIZE / cols
            const pieceHeight = CANVAS_SIZE / rows

            const newPieces: PuzzlePiece[] = []
            let pieceId = 0

            const fullCanvas = document.createElement('canvas')
            fullCanvas.width = CANVAS_SIZE
            fullCanvas.height = CANVAS_SIZE
            const fullCtx = fullCanvas.getContext('2d')
            
            if (!fullCtx) {
              console.error('Failed to get canvas context')
              resolve()
              return
            }

            fullCtx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                if (pieceId >= puzzleData.pieces) break

                const x = Math.floor(col * pieceWidth)
                const y = Math.floor(row * pieceHeight)

                const width = (col === cols - 1)
                  ? CANVAS_SIZE - x
                  : Math.floor(pieceWidth)

                const height = (row === rows - 1)
                  ? CANVAS_SIZE - y
                  : Math.floor(pieceHeight)

                const pieceCanvas = document.createElement('canvas')
                pieceCanvas.width = width
                pieceCanvas.height = height

                const pieceCtx = pieceCanvas.getContext('2d')
                if (!pieceCtx) continue

                pieceCtx.drawImage(
                  fullCanvas,
                  x, y, width, height,
                  0, 0, width, height
                )

                // عكس ترتيب الأعمدة لتتوافق مع العرض RTL
                const rtlCol = (cols - 1) - col
                const correctSlotId = row * cols + rtlCol

                newPieces.push({
                  id: pieceId,
                  correctSlotId: correctSlotId,
                  image: pieceCanvas.toDataURL('image/png', 1.0),
                })

                console.log(`✓ القطعة ${pieceId} - تمت الإضافة`, {
                  col: col,
                  rtlCol: rtlCol,
                  row: row,
                  correctSlotId: correctSlotId
                })

                pieceId++
              }
            }

            const shuffled = [...newPieces].sort(() => Math.random() - 0.5)
            setPieces(shuffled)

            setSlots(Array(puzzleData.pieces).fill(null))

            console.log(`=== ملخص القطع ===`)
            console.log(`عدد القطع المطلوب: ${puzzleData.pieces}`)
            console.log(`عدد القطع المُنشأة: ${newPieces.length}`)
            console.log(`الشبكة: ${cols}x${rows}`)
            console.log(`حجم القطعة: ${Math.floor(pieceWidth)}x${Math.floor(pieceHeight)}`)

            if (newPieces.length !== puzzleData.pieces) {
              console.warn(`⚠️ عدد القطع المُنشأة (${newPieces.length}) لا يطابق العدد المطلوب (${puzzleData.pieces})`)
            }
            
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
    if (placedPieces.length !== pieces.length) {
      toast({
        title: 'لم تكمل اللعبة',
        description: `أكمل جميع القطع (${placedPieces.length}/${pieces.length})`,
        variant: 'destructive',
      })
      playSound('error')
      return
    }

    setChecking(true)

    let isCorrect = true
    let wrongPieces: number[] = []
    
    console.log('=== بدء التحقق من الحل ===')
    console.log('عدد الأعمدة:', gridCols)
    
    for (const placed of placedPieces) {
      const piece = pieces.find(p => p.id === placed.pieceId)
      if (!piece) continue
      
      console.log(`القطعة ${piece.id}:`, {
        correctSlotId: piece.correctSlotId,
        actualSlotId: placed.slotId,
        isCorrect: piece.correctSlotId === placed.slotId
      })

      if (piece.correctSlotId !== placed.slotId) {
        isCorrect = false
        wrongPieces.push(placed.pieceId)
      }
    }
    
    console.log('=== نتيجة التحقق ===')
    console.log('الحل صحيح؟', isCorrect)
    console.log('القطع الخاطئة:', wrongPieces)

    if (!isCorrect) {
      playSound('error')
      toast({
        title: 'الحل غير صحيح',
        description: `هناك ${wrongPieces.length} قطعة في أماكن خاطئة. حاول مرة أخرى!`,
        variant: 'destructive',
      })
      setChecking(false)
      return
    }

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

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8"
              >
                <button
                  onClick={() => setShowSuccess(false)}
                  className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="إغلاق"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="text-center space-y-6">
                  {/* Trophy Icon */}
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>

                  {/* Success Message */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      أحسنت! 🎉
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      لقد أكملت اللعبة بنجاح
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 justify-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-6 py-4 flex-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">النقاط</div>
                      <div className="text-2xl font-bold text-primary">+{game.pointsReward}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-6 py-4 flex-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">الحركات</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{moves}</div>
                    </div>
                  </div>

                  {/* Educational Message */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-right">
                    <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed">
                      {game.educationalMessage}
                    </p>
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => router.push('/games')}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-medium"
                    size="lg"
                  >
                    العودة إلى الألعاب
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

        <div className="grid lg:grid-cols-5 gap-6">
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
                      {placedPieces.length}/{pieces.length}
                    </span>
                    {debugMode && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded font-bold">
                        وضع التشخيص 🔧
                      </span>
                    )}
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
                {puzzleData?.imageUrl && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الصورة الأصلية:</div>
                    <div className="relative w-full max-w-[200px] mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={puzzleData.imageUrl}
                        alt="Original puzzle"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                <div
                  className="mx-auto mb-6 sm:mb-8 bg-white dark:bg-gray-800"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gap: '0',
                    maxWidth: '100%',
                    width: 'min(100%, 600px)',
                    aspectRatio: '1 / 1',
                    border: '2px solid #6B7280',
                    padding: '0',
                    margin: '0 auto',
                  }}
                >
                  {slots.map((_, slotIndex) => {
                    const placedPiece = getPlacedPieceAtSlot(slotIndex)
                    
                    let isCorrectPlacement = false
                    if (debugMode && placedPiece) {
                      isCorrectPlacement = placedPiece.correctSlotId === slotIndex
                    }

                    return (
                      <button
                        key={slotIndex}
                        onClick={() => handleSlotClick(slotIndex)}
                        className={`relative w-full h-full overflow-hidden ${
                          placedPiece
                            ? 'bg-white dark:bg-gray-800'
                            : selectedPiece !== null
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } ${debugMode && placedPiece ? (isCorrectPlacement ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500') : ''}`}
                        style={{
                          aspectRatio: '1 / 1',
                          border: '1px solid #9CA3AF',
                          margin: '0',
                          padding: '0',
                        }}
                      >
                        {placedPiece ? (
                          <>
                            <img
                              src={placedPiece.image}
                              alt="puzzle piece"
                              className="w-full h-full object-cover block"
                              style={{ 
                                display: 'block', 
                                margin: '0', 
                                padding: '0',
                                imageRendering: 'crisp-edges'
                              }}
                            />
                            {debugMode && (
                              <div className={`absolute top-1 right-1 ${isCorrectPlacement ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded font-bold`}>
                                {isCorrectPlacement ? '✓' : '✗'}
                              </div>
                            )}
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUndo(slotIndex)
                              }}
                              className="absolute inset-0 bg-red-600/0 hover:bg-red-600/90 flex flex-col items-center justify-center text-white font-bold cursor-pointer transition-colors duration-200 opacity-0 hover:opacity-100"
                            >
                              <X className="h-6 w-6 mb-1" />
                              <span className="text-xs">إزالة</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-xl text-gray-400 dark:text-gray-600">
                            {selectedPiece !== null ? '✓' : ''}
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white rounded">
                          {slotIndex + 1}
                        </div>
                      </button>
                    )
                  })}
                </div>

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
                          style={{ imageRendering: 'crisp-edges' }}
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