'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Game, CrosswordData } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CrosswordPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
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
      setCrosswordData(response.game.gameData as CrosswordData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleComplete = async () => {
    if (!game || !crosswordData) return

    // Check if all answers are correct (simplified version)
    const allCorrect = crosswordData.clues.every((clue) => {
      const userAnswer = answers[clue.number]?.trim().toLowerCase()
      const correctAnswer = clue.answer.trim().toLowerCase()
      return userAnswer === correctAnswer
    })

    if (!allCorrect) {
      toast({
        title: 'خطأ',
        description: 'بعض الإجابات غير صحيحة. حاول مرة أخرى.',
        variant: 'destructive',
      })
      return
    }

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
        description: t('games.crosswordSuccess'),
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

  if (!game || !crosswordData) {
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
          <div className="space-y-4">
            {crosswordData.clues.map((clue) => (
              <div key={clue.number} className="space-y-2">
                <label className="text-sm font-medium">
                  {clue.number}. ({clue.direction === 'across' ? 'أفقي' : 'عمودي'})
                  {' - '}
                  {clue.clue}
                </label>
                <Input
                  value={answers[clue.number] || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [clue.number]: e.target.value })
                  }
                  placeholder="أدخل الإجابة"
                  disabled={completed}
                />
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleComplete}
            disabled={
              completed ||
              Object.keys(answers).length !== crosswordData.clues.length
            }
          >
            {completed ? 'تم الإكمال!' : 'إرسال الإجابات'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
