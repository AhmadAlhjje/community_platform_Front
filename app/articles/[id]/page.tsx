'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Article, Survey, SurveyResponse, SurveySubmitResponse } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, BookOpen, Trophy, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [result, setResult] = useState<SurveySubmitResponse['data'] | null>(null)
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
      const response = await apiClient.get<SurveyResponse>(
        `/api/surveys/article/${params.id}`
      )
      if (response.success && response.data) {
        setSurvey(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFinishReading = () => {
    setShowQuiz(true)
  }

  const handleSubmitQuiz = async () => {
    if (!survey) return

    const answers = Object.keys(selectedAnswers).map((questionId) => ({
      questionId,
      optionId: selectedAnswers[questionId],
    }))

    try {
      const response = await apiClient.post<SurveySubmitResponse>(
        `/api/surveys/${survey.id}/submit`,
        { answers },
        true
      )

      if (response.success && response.data) {
        setResult(response.data)

        const pointsMessage = response.data.passed
          ? `مبروك! لقد حصلت على ${response.data.points} نقطة`
          : 'للأسف، تحتاج إلى 70% على الأقل للحصول على النقاط'

        toast({
          title: response.data.passed ? 'نجحت!' : 'حاول مرة أخرى',
          description: pointsMessage,
          variant: response.data.passed ? 'success' : 'destructive',
        })
      }
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
      <div className="space-y-8">
        {/* Results Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden p-8 md:p-12"
          style={{
            backgroundImage: result.passed ? 'url(/images/hero-community.webp)' : 'url(/images/OIP2.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

          <div className="relative flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                result.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {result.passed ? (
                  <Trophy className="h-12 w-12 text-green-600 dark:text-green-400" />
                ) : (
                  <Target className="h-12 w-12 text-red-600 dark:text-red-400" />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {result.passed ? '🎉 مبروك!' : '💪 حاول مرة أخرى'}
              </h1>
              <p className="text-xl text-muted-foreground mt-4">
                النتيجة: {result.correctAnswers}/{result.totalQuestions} ({result.percentage.toFixed(0)}%)
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <Image src="/images/OIP1.webp" alt="Results" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/98" />

              <CardContent className="relative p-8 text-center">
                {result.passed ? (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-full border-2 border-green-200 dark:border-green-800"
                    >
                      <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{result.points} نقطة
                      </span>
                    </motion.div>
                    <p className="text-lg text-muted-foreground">
                      أحسنت! لقد حصلت على أكثر من 70% من الإجابات الصحيحة
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      تحتاج إلى 70% على الأقل للحصول على النقاط
                    </p>
                    <p className="text-muted-foreground">
                      نتيجتك: {result.percentage.toFixed(0)}% - راجع المقالة وحاول مرة أخرى
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/articles">
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg" size="lg">
                <ArrowLeft className="h-5 w-5 ml-2" />
                <span className="font-semibold">العودة إلى المقالات</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  if (showQuiz && survey) {
    return (
      <div className="space-y-8">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-8 md:p-12"
          style={{
            backgroundImage: 'url(/images/hero-community.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

          <div className="relative space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-primary font-semibold">اختبار المعلومات</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {survey.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              أجب على {survey.questions.length} أسئلة واحصل على النقاط
            </p>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {survey.questions.map((question, qIndex) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <Image src="/images/OIP2.jpeg" alt="Question" fill className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/98" />

                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center"
                    >
                      <span className="text-white font-bold">{qIndex + 1}</span>
                    </motion.div>
                    <CardTitle className="text-lg">
                      {t('articles.question')} {qIndex + 1} {t('articles.of')} {survey.questions.length}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium">{question.questionText}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {question.options.map((option, optIndex) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={
                          selectedAnswers[question.id] === option.id
                            ? 'default'
                            : 'outline'
                        }
                        className={`w-full justify-start text-right h-auto py-3 ${
                          selectedAnswers[question.id] === option.id
                            ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg'
                            : ''
                        }`}
                        onClick={() =>
                          setSelectedAnswers({
                            ...selectedAnswers,
                            [question.id]: option.id,
                          })
                        }
                      >
                        <span className="flex-1">{option.optionText}</span>
                        {selectedAnswers[question.id] === option.id && (
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: survey.questions.length * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl"
              size="lg"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length !== survey.questions.length}
            >
              <Trophy className="h-5 w-5 ml-2" />
              <span className="font-semibold">{t('articles.submitQuiz')}</span>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-8 md:p-12"
        style={{
          backgroundImage: 'url(/images/OIP1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />

        <div className="relative space-y-4">
          <Link href="/articles">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 ml-2" />
                {t('articles.backToArticles')}
              </Button>
            </motion.div>
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BookOpen className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-primary font-semibold">
              {article.category?.name || 'مقالة توعوية'}
            </span>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {article.title}
          </h1>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Image src="/images/OIP1.webp" alt="Article" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/98" />

            <CardContent className="relative py-8 px-6 md:px-10">
              <div className="prose dark:prose-invert max-w-none prose-lg">
                <div className="whitespace-pre-wrap leading-relaxed text-lg">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="mb-6"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quiz Button */}
        {survey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center"
                  >
                    <Target className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">اختبر معلوماتك!</h3>
                    <p className="text-sm text-muted-foreground">أجب على الأسئلة واحصل على نقاط</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg"
                    size="lg"
                    onClick={handleFinishReading}
                  >
                    <span className="font-semibold">ابدأ الاختبار</span>
                    <motion.div
                      animate={{ x: [-2, 0, -2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mr-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
