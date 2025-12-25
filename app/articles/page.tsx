'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Category, Article } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, CheckCircle2, ArrowRight, Filter } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ArticlesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const router = useRouter()

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
          backgroundImage: 'url(/images/مقالات.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/55 to-background/60" />

        <div className="relative space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 rounded-full border-2 border-foreground/20 shadow-lg backdrop-blur-sm"
          >
            <BookOpen className="h-5 w-5 text-foreground drop-shadow-md" />
            <span className="text-foreground font-bold drop-shadow-md">مقالات توعوية قيّمة!</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            اقرأ وتعلم واختبر <span className="text-primary drop-shadow-md font-extrabold">معلوماتك!</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            مقالات توعوية شاملة مع أسئلة تفاعلية لاختبار فهمك
          </p>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-4"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-5 w-5" />
          <span className="font-medium">تصنيف حسب:</span>
        </div>
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedCategory(null)
              fetchArticles()
            } else {
              handleCategoryClick(value)
            }
          }}
        >
          <SelectTrigger className="w-[280px] bg-background border-2 hover:border-primary/50 transition-colors">
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>جميع المقالات</span>
              </div>
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

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
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 cursor-pointer">
                {/* صورة الخلفية */}
                <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300">
                  <Image
                    src="/images/مقالات.jpg"
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-background/60 group-hover:via-background/40 group-hover:to-background/50 transition-all duration-300" />

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
                        className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium shadow-sm"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        مقروءة
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="drop-shadow-sm text-foreground font-bold">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-foreground/80 font-medium drop-shadow-sm">
                    {article.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto relative">
                  <div className="flex items-center justify-between text-sm text-muted-foreground bg-background/50 backdrop-blur-sm rounded-lg p-3">
                    <span className="font-medium">
                      {article.hasRead ? 'إعادة القراءة' : 'اقرأ الآن'}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
