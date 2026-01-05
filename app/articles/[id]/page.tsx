'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api-client'
import { Article, Survey, SurveyResponse, SurveySubmitResponse } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, BookOpen, Trophy, Target, Sparkles, User, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [currentPage, setCurrentPage] = useState(0)
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next')
  const articleContentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { toast } = useToast()

  // Get words per page from env or default to 400
  const wordsPerPage = parseInt(process.env.NEXT_PUBLIC_ARTICLE_WORDS_PER_PAGE || '400', 10)

  useEffect(() => {
    fetchArticle()
    fetchSurvey()
  }, [params.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToPrevPage()
      } else if (e.key === 'ArrowLeft') {
        goToNextPage()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, article])

  // Scroll to article content when page changes
  useEffect(() => {
    if (articleContentRef.current) {
      articleContentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [currentPage])

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
    // Scroll to top smoothly when quiz starts
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to split content by word count
  const splitContentByWords = (content: string): string[][] => {
    // Split by both \n\n and \n to get all text blocks
    const allParagraphs = content.split(/\n+/).filter(p => p.trim())

    // If we have very few paragraphs, split the content by words directly
    if (allParagraphs.length <= 3) {
      const allWords = content.trim().split(/\s+/)
      const totalWords = allWords.length
      const pages: string[][] = []

      let currentIndex = 0
      while (currentIndex < totalWords) {
        const pageWords = allWords.slice(currentIndex, currentIndex + wordsPerPage)
        const pageText = pageWords.join(' ')
        pages.push([pageText])
        currentIndex += wordsPerPage
      }

      return pages
    }

    // Original logic for multiple paragraphs
    const pages: string[][] = []
    let currentPageParagraphs: string[] = []
    let currentWordCount = 0

    for (const paragraph of allParagraphs) {
      const words = paragraph.trim().split(/\s+/)
      const paragraphWordCount = words.length

      // If adding this paragraph exceeds the limit and we have content, start new page
      if (currentWordCount + paragraphWordCount > wordsPerPage && currentPageParagraphs.length > 0) {
        pages.push([...currentPageParagraphs])
        currentPageParagraphs = [paragraph]
        currentWordCount = paragraphWordCount
      } else {
        currentPageParagraphs.push(paragraph)
        currentWordCount += paragraphWordCount
      }
    }

    // Add remaining paragraphs as last page
    if (currentPageParagraphs.length > 0) {
      pages.push(currentPageParagraphs)
    }

    return pages
  }

  // Pagination functions
  const goToNextPage = () => {
    if (!article) return
    const pages = splitContentByWords(article.content)

    if (currentPage < pages.length - 1) {
      setPageDirection('next')
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setPageDirection('prev')
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageIndex: number) => {
    if (!article) return
    const pages = splitContentByWords(article.content)

    if (pageIndex >= 0 && pageIndex < pages.length) {
      setPageDirection(pageIndex > currentPage ? 'next' : 'prev')
      setCurrentPage(pageIndex)
    }
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
                        className={`w-full justify-start text-right h-auto py-3 px-4 ${
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
                        <span className="flex-1 text-right break-words whitespace-normal leading-relaxed">{option.optionText}</span>
                        {selectedAnswers[question.id] === option.id && (
                          <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
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

          {/* Author and Source Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border/50"
          >
            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <User className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">الكاتب</span>
                  <span className="text-sm font-semibold text-foreground">{article.author}</span>
                </div>
              </div>
            )}

            {/* Source */}
            {article.source && (
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded-lg border border-border transition-colors group"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">المصدر</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    زيارة المصدر الأصلي
                  </span>
                </div>
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Article Content - Book Style with Pagination */}
      <div ref={articleContentRef} className="max-w-4xl mx-auto">
        {(() => {
          const pages = splitContentByWords(article.content)
          const totalPages = pages.length
          const currentParagraphs = pages[currentPage] || []

          return (
            <>
              <motion.div
                key={currentPage}
                initial={{
                  opacity: 0,
                  rotateY: pageDirection === 'next' ? 15 : -15,
                  x: pageDirection === 'next' ? -100 : 100,
                  transformOrigin: pageDirection === 'next' ? 'right' : 'left'
                }}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  x: 0,
                  transformOrigin: 'center'
                }}
                exit={{
                  opacity: 0,
                  rotateY: pageDirection === 'next' ? -15 : 15,
                  x: pageDirection === 'next' ? 100 : -100,
                  transformOrigin: pageDirection === 'next' ? 'right' : 'left'
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for book flip
                }}
                style={{ perspective: '2000px' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                whileDrag={{
                  scale: 0.98,
                  cursor: 'grabbing',
                  rotateY: 2
                }}
                className="cursor-grab"
                onDragEnd={(_, { offset, velocity }) => {
                  const swipeDistance = offset.x
                  const swipeVelocity = velocity.x

                  // Swipe right (next page) - السحب لليمين = الصفحة التالية
                  if (swipeDistance > 50 && swipeVelocity > 0 && currentPage < totalPages - 1) {
                    goToNextPage()
                  }
                  // Swipe left (previous page) - السحب لليسار = الصفحة السابقة
                  else if (swipeDistance < -50 && swipeVelocity < 0 && currentPage > 0) {
                    goToPrevPage()
                  }
                }}
              >
                <Card className="relative overflow-hidden shadow-2xl border-2" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Page flip shadow effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    exit={{
                      opacity: pageDirection === 'next' ? 0.3 : 0.3,
                      background: pageDirection === 'next'
                        ? 'linear-gradient(to left, rgba(0,0,0,0.2), transparent)'
                        : 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)'
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Book-like texture background */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <Image src="/images/OIP1.webp" alt="Article" fill className="object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-background/98 to-orange-50/30 dark:from-slate-900/40 dark:via-background/98 dark:to-slate-800/30" />

                  {/* Decorative book spine effect */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary/10 to-transparent" />
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary/10 to-transparent" />

                  {/* Swipe indicators */}
                  {currentPage > 0 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity pointer-events-none">
                      <ChevronRight className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                  )}
                  {currentPage < totalPages - 1 && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity pointer-events-none">
                      <ChevronLeft className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                  )}

                  <CardContent className="relative py-12 px-8 md:px-16 lg:px-20 min-h-[600px] flex flex-col">
                    {/* Decorative top border */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                      <BookOpen className="h-5 w-5 mx-4 text-primary/70" />
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    </div>

                    {/* Article content with book-style typography */}
                    <div className="prose dark:prose-invert max-w-none prose-lg flex-1">
                      <div
                        className="leading-[2] text-justify"
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          textIndent: '2rem',
                          hyphens: 'auto',
                        }}
                      >
                        {currentParagraphs.map((paragraph, index) => {
                          // Check if paragraph is a heading
                          const isHeading = paragraph.trim().endsWith(':') ||
                                           (paragraph.trim().length < 50 && !paragraph.includes('،') && !paragraph.includes('.'))

                          if (isHeading) {
                            return (
                              <motion.h2
                                key={`${currentPage}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="text-2xl md:text-3xl font-bold text-primary mb-6 mt-10 text-center"
                                style={{ textIndent: '0', fontFamily: 'inherit' }}
                              >
                                {paragraph}
                              </motion.h2>
                            )
                          }

                          return (
                            <motion.p
                              key={`${currentPage}-${index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="mb-6 text-foreground/90 text-base md:text-lg"
                            >
                              {paragraph}
                            </motion.p>
                          )
                        })}
                      </div>
                    </div>

                    {/* Page number at bottom */}
                    <div className="flex items-center justify-center mt-8 pt-4 border-t border-border/30">
                      <span className="text-sm text-muted-foreground font-serif">
                        صفحة {currentPage + 1} من {totalPages}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Navigation buttons - Simplified */}
              <div className="flex items-center justify-center mt-6 gap-6">
                {/* Previous button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Page number */}
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium text-foreground">
                    صفحة {currentPage + 1} من {totalPages}
                  </span>
                </div>

                {/* Next button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
            </>
          )
        })()}

        {/* Quiz Button */}
        {survey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 max-w-4xl mx-auto"
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
