'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Article, Survey, SurveyResult } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [result, setResult] = useState<SurveyResult | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    fetchArticle()
    fetchSurvey()
  }, [params.id])

  const fetchArticle = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Article }>(`/api/articles/${params.id}`)
      setArticle(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSurvey = async () => {
    try {
      const response = await apiClient.get<{ survey: Survey }>(
        `/api/surveys/article/${params.id}`
      )
      setSurvey(response.survey)
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAsRead = async () => {
    try {
      await apiClient.post(`/api/articles/${params.id}/read`, {}, true)
      setShowQuiz(true)
      toast({
        title: t('common.success'),
        description: '+5 نقاط للقراءة',
        variant: 'success',
      })
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!survey) return

    const answers = Object.keys(selectedAnswers).map((questionId) => ({
      questionId,
      optionId: selectedAnswers[questionId],
    }))

    try {
      const response = await apiClient.post<{ result: SurveyResult }>(
        `/api/surveys/${survey.id}/submit`,
        { answers },
        true
      )
      setResult(response.result)
      toast({
        title: response.result.passed ? t('articles.passed') : t('articles.failed'),
        description: `${t('articles.yourScore')}: ${response.result.score}/${response.result.totalQuestions}`,
        variant: response.result.passed ? 'success' : 'destructive',
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (loading || !article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2
                className={`h-16 w-16 ${
                  result.passed ? 'text-success' : 'text-destructive'
                }`}
              />
            </div>
            <CardTitle className="text-center">
              {result.passed ? t('articles.passed') : t('articles.failed')}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {t('articles.yourScore')}: {result.score}/{result.totalQuestions} (
              {result.percentage.toFixed(0)}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/articles">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 ml-2" />
                {t('articles.backToArticles')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showQuiz && survey) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">{survey.title}</h1>
          <p className="text-muted-foreground">أجب على الأسئلة التالية</p>
        </div>

        {survey.questions.map((question, qIndex) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('articles.question')} {qIndex + 1} {t('articles.of')}{' '}
                {survey.questions.length}
              </CardTitle>
              <CardDescription>{question.questionText}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  variant={
                    selectedAnswers[question.id] === option.id
                      ? 'default'
                      : 'outline'
                  }
                  className="w-full justify-start"
                  onClick={() =>
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [question.id]: option.id,
                    })
                  }
                >
                  {option.optionText}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmitQuiz}
          disabled={Object.keys(selectedAnswers).length !== survey.questions.length}
        >
          {t('articles.submitQuiz')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/articles">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 ml-2" />
          {t('articles.backToArticles')}
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          {article.category && (
            <CardDescription>{article.category.name}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </CardContent>
      </Card>

      {!article.hasRead && survey && (
        <Button className="w-full" size="lg" onClick={handleMarkAsRead}>
          {t('articles.takeQuiz')}
        </Button>
      )}
    </div>
  )
}
