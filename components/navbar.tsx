'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Gamepad2, MessageSquare, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const [currentPoints, setCurrentPoints] = useState(user?.points || 0)

  // Update points when user changes or when navigating
  useEffect(() => {
    if (user?.id) {
      fetchUserPoints()
    }
  }, [user?.id, pathname])

  const fetchUserPoints = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: { points: number } }>(
        `/api/users/${user?.id}/points`,
        true
      )
      if (response.success && response.data) {
        setCurrentPoints(response.data.points)
      }
    } catch (error) {
      // Fallback to user.points if API call fails
      setCurrentPoints(user?.points || 0)
    }
  }

  const navItems = [
    { href: '/dashboard', label: t('common.home'), icon: Home },
    { href: '/articles', label: t('articles.title'), icon: BookOpen },
    { href: '/games', label: t('games.title'), icon: Gamepad2 },
    { href: '/polls', label: t('polls.title'), icon: MessageSquare },
    { href: '/profile', label: t('common.profile'), icon: User },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">{t('common.appName')}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-accent">
              <span className="text-sm font-medium">{currentPoints}</span>
              <span className="text-xs text-muted-foreground">
                {t('common.points')}
              </span>
            </div>
          )}
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label={t('common.logout')}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
