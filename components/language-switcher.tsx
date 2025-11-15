'use client'

import { Languages } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/language-store'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">{language === 'ar' ? 'EN' : 'AR'}</span>
    </Button>
  )
}
