'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Game, PuzzleData } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PuzzlePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null)
  const [completed, setCompleted] = useState(false)
  const [startTime] = useState(Date.now())
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchGame()
  }, [params.id])

  const fetchGame = async () => {
    try {
      const response = await apiClient.get<{ game: Game }>(`/api/games/${params.id}`)
      setGame(response.game)
      setPuzzleData(response.game.gameData as PuzzleData)
    } catch (error) {
      console.error(error)
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
      toast({
        title: t('common.success'),
        description: t('games.puzzleSuccess'),
        variant: 'success',
      })
      setTimeout(() => router.push('/games'), 2000)
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
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/games">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للألعاب
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{game.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            {puzzleData.imageUrl && (
              <Image
                src={puzzleData.imageUrl}
                alt={game.title}
                fill
                className="object-cover"
              />
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              عدد القطع: {puzzleData.pieces}
            </p>
            <p className="text-sm text-muted-foreground">
              قم بترتيب القطع لإكمال الصورة
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground p-4 bg-accent rounded-lg">
            ملاحظة: هذه نسخة تجريبية. في النسخة النهائية، ستجد لعبة بازل تفاعلية
            كاملة مع إمكانية سحب وإسقاط القطع.
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleComplete}
            disabled={completed}
          >
            {completed ? 'تم الإكمال!' : 'إكمال اللعبة (تجريبي)'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
