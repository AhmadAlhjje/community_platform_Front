'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Gamepad2, MessageSquare, User, LogOut, Menu, X, Trophy, Info, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const [currentPoints, setCurrentPoints] = useState(user?.points || 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Update points when user changes or when navigating
  useEffect(() => {
    if (user?.id) {
      fetchUserPoints()
    }
  }, [user?.id, pathname])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

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
      setCurrentPoints(user?.points || 0)
    }
  }

  // Separate navigation items into main and public
  const mainNavItems = [
    { href: '/dashboard', label: t('common.home'), icon: Home },
    { href: '/articles', label: t('articles.title'), icon: BookOpen },
    { href: '/games', label: t('games.title'), icon: Gamepad2 },
    { href: '/polls', label: t('polls.title'), icon: MessageSquare },
    { href: '/profile', label: t('common.profile'), icon: User },
  ]

  const publicNavItems = [
    { href: '/about', label: 'من نحن', icon: Info },
    { href: '/contact', label: 'تواصل معنا', icon: Mail },
  ]

  const navItems = [...mainNavItems, ...publicNavItems]

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and Brand */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href={user ? "/dashboard" : "/"}
                className="flex items-center gap-2 group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                >
                  <span className="text-primary-foreground font-bold text-sm">م</span>
                </motion.div>
                {/* <span className="text-lg font-bold hidden sm:inline-block text-foreground group-hover:text-primary transition-colors">
                  {t('common.appName')}
                </span> */}
              </Link>

              {/* Desktop Navigation - Center */}
              <div className="hidden md:flex items-center gap-1 md:ml-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Points Display - Desktop Only */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50"
                >
                  <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{currentPoints}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-500 hidden sm:inline">
                    {t('common.points')}
                  </span>
                </motion.div>
              )}

              {/* Theme & Language Switchers - Desktop */}
              <div className="hidden sm:flex items-center gap-1 border-l border-border pl-2 sm:pl-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>

              {/* Logout Button - Desktop */}
              {user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    aria-label={t('common.logout')}
                    className="hidden sm:flex"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background border-l border-border shadow-2xl md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">م</span>
                  </div>
                  <span className="font-bold text-foreground">{t('common.appName')}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-9 w-9"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info - Mobile */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-4 border-b border-border bg-muted/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                    <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{currentPoints}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-500">{t('common.points')}</span>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4 px-2">
                <div className="space-y-1">
                  {/* Main navigation section */}
                  <div className="mb-3">
                    {mainNavItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Divider */}
                  <div className="my-2 border-t border-border" />

                  {/* Public pages section */}
                  <div>
                    {publicNavItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (mainNavItems.length + index) * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer - Settings & Logout */}
              <div className="border-t border-border px-4 py-4 space-y-3">
                <div className="flex items-center gap-2 justify-center">
                  <ThemeSwitcher />
                  <div className="w-px h-5 bg-border" />
                  <LanguageSwitcher />
                </div>
                {user && (
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 font-medium"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      logout()
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('common.logout')}
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
