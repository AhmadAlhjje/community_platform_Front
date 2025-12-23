'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LogIn, ArrowRight, Sparkles, Phone, Eye, EyeOff } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  // Show loading while checking user status
  if (user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ phoneNumber, password })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              src="/images/logo.png"
              alt="صوتنا يبني"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold hidden sm:inline">{t('common.appName')}</span>
        </Link>
        <div className="flex gap-2">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">أهلاً بعودتك!</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                تسجيل الدخول سهل وآمن. ابدأ رحلتك التوعوية معنا الآن
              </p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-2 pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <LogIn className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-center text-foreground">
                  {t('auth.loginTitle')}
                </CardTitle>
                <CardDescription className="text-center text-base">
                  أدخل بيانات حسابك للدخول
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5 pb-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف
                      </div>
                    </Label>
                    <PhoneInput
                      international
                      defaultCountry="SY"
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value || '')}
                      className="phone-input-custom"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 text-base pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.loginButton')}
                    {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">
                        أم أنك جديد؟
                      </span>
                    </div>
                  </div>

                  <Link href="/auth/register" className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 text-base font-medium"
                    >
                      {t('auth.registerHere')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </form>
            </Card>

            <p className="text-sm text-center text-muted-foreground mt-6">
              بالدخول تقبل{' '}
              <Link href="/" className="text-primary hover:underline">
                شروط الاستخدام
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
