import { useLanguageStore } from '@/lib/store/language-store'
import arTranslations from '@/i18n/ar.json'
import enTranslations from '@/i18n/en.json'

type TranslationKey = string

const translations = {
  ar: arTranslations,
  en: enTranslations,
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)

  const t = (key: TranslationKey): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key
  }

  return { t, language }
}
