'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Gamepad2, MessageSquare, User, LogOut, Menu, X, Trophy, Info, Mail, HelpCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function PublicNavbar() {
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
    { href: '/polls/results', label: 'نتائج الاستطلاعات', icon: Trophy },
    // { href: '/leaderboard', label: 'لوحة الصدارة', icon: Medal },
    { href: '/profile', label: t('common.profile'), icon: User },
  ]

  const publicNavItems = [
    { href: '/how-it-works', label: 'كيف تعمل المنصة', icon: HelpCircle },
    { href: '/about', label: 'من نحن', icon: Info },
    { href: '/contact', label: 'تواصل معنا', icon: Mail },
  ]

  const guestNavItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    ...publicNavItems
  ]

  // If logged in, show authenticated navbar, otherwise show guest navbar
  const navItems = user ? [...mainNavItems, ...publicNavItems] : guestNavItems

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-3 sm:px-5 lg:px-7">
          <div className="flex h-15 items-center justify-between">
            {/* Left: Logo and Brand */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href={user ? "/dashboard" : "/"}
                className="flex items-center gap-1.5 sm:gap-2 group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                >
                  <Image
                    src="/images/logo.png"
                    alt="صوتنا يبني"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </Link>

              {/* Desktop Navigation - Right */}
              <div className="hidden xl:flex items-center gap-1.5 mr-auto ml-5">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Points Display - Desktop Only */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
                >
                  <Trophy className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                  <span className="text-sm font-bold text-amber-900 dark:text-amber-100">{currentPoints}</span>
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {t('common.points')}
                  </span>
                </motion.div>
              )}

              {/* Theme & Language Switchers - Desktop */}
              <div className="hidden xl:flex items-center gap-1 border-l border-border pl-2">
                <ThemeSwitcher />
              </div>

              {/* Logout Button - Desktop (Only for logged in users) */}
              {user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden xl:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    aria-label={t('common.logout')}
                    className="h-9 w-9 p-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* Login Button - Desktop (Only for non-logged in users) */}
              {!user && (
                <Link href="/auth/login" className="hidden xl:block">
                  <Button variant="default" size="sm" className="text-sm px-3 py-1.5">
                    دخول
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="xl:hidden"
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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] sm:w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl xl:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border">
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 min-w-0">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="صوتنا يبني"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold text-foreground text-sm sm:text-base truncate">صوتنا يبني</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* User Info - Mobile */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border bg-muted/30"
                >
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700 dark:text-amber-300 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-100">{currentPoints}</span>
                    <span className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-200">{t('common.points')}</span>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-3 sm:py-4 px-2">
                <div className="space-y-1">
                  {user && (
                    <>
                      {/* Main navigation section */}
                      <div className="mb-2 sm:mb-3">
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
                                  'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                                  isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="flex-1 truncate">{item.label}</span>
                              </Link>
                            </motion.div>
                          )
                        })}
                      </div>

                      {/* Divider */}
                      <div className="my-2 border-t border-border" />
                    </>
                  )}

                  {/* Public pages section */}
                  <div>
                    {(user ? publicNavItems : guestNavItems).map((item, index) => {
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
                              'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                            <span className="flex-1 truncate">{item.label}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer - Settings & Logout */}
              <div className="border-t border-border px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 justify-center">
                  <ThemeSwitcher />
                  <div className="w-px h-5 bg-border" />
                </div>

                {user ? (
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 font-medium text-xs sm:text-sm py-2 sm:py-2.5"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      logout()
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {t('common.logout')}
                  </Button>
                ) : (
                  <Link href="/auth/login" className="w-full">
                    <Button variant="default" className="w-full justify-center gap-2 font-medium text-xs sm:text-sm py-2 sm:py-2.5">
                      دخول
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
