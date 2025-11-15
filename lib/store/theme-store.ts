import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const storage = typeof window !== 'undefined' ? localStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)
          }
          return { theme: newTheme }
        }),
      setTheme: (theme) => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark')
          document.documentElement.classList.add(theme)
        }
        set({ theme })
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => storage as any),
    }
  )
)
