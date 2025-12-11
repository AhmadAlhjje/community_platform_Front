'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Category, Article } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function ArticlesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    fetchCategories()
    fetchArticles()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Category[] }>('/api/categories')
      setCategories(response.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchArticles = async (categoryId?: string) => {
    try {
      setLoading(true)
      const endpoint = categoryId
        ? `/api/articles/category/${categoryId}`
        : '/api/articles'
      const response = await apiClient.get<{ success: boolean; data: Article[] }>(endpoint)
      setArticles(response.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    fetchArticles(categoryId)
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-primary font-semibold">مقالات توعوية قيّمة!</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            اقرأ وتعلم واختبر <span className="text-primary">معلوماتك!</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            مقالات توعوية شاملة مع أسئلة تفاعلية لاختبار فهمك
          </p>
        </div>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => {
            setSelectedCategory(null)
            fetchArticles()
          }}
        >
          الكل
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p>{t('common.loading')}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 cursor-pointer">
                {/* صورة الخلفية */}
                <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Image
                    src="/images/OIP1.webp"
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-background/95 group-hover:via-background/85 transition-all duration-300" />

                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md"
                    >
                      <BookOpen className="h-6 w-6 text-white" />
                    </motion.div>
                    {article.hasRead && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        مقروءة
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto relative">
                  <Link href={`/articles/${article.id}`} className="block">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="w-full relative group bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                        <span className="font-semibold">
                          {article.hasRead ? 'إعادة القراءة' : t('articles.readMore')}
                        </span>
                        <motion.div
                          animate={{ x: [-3, 0, -3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="mr-2"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
