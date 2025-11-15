'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme-store'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  )
}
