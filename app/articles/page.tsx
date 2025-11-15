'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Category, Article } from '@/types/api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2 } from 'lucide-react'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('articles.title')}</h1>
        <p className="text-muted-foreground">{t('articles.categories')}</p>
      </div>

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
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <BookOpen className="h-6 w-6 text-primary" />
                    {article.hasRead && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={`/articles/${article.id}`}>
                    <Button className="w-full">
                      {article.hasRead ? 'إعادة القراءة' : t('articles.readMore')}
                    </Button>
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
