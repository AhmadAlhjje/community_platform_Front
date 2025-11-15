import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Language = 'ar' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

const storage = typeof window !== 'undefined' ? localStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (language) => {
        if (typeof window !== 'undefined') {
          document.documentElement.lang = language
          document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
        }
        set({ language })
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => storage as any),
    }
  )
)
