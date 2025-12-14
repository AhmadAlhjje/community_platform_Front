'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { UserPlus, ArrowRight, Sparkles, Phone, Shield, AlertCircle } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [hasPendingVerification, setHasPendingVerification] = useState(false)
  const { register, verifyOTP, resendOTP } = useAuth()
  const { t } = useTranslation()

  // Check for pending verification on component mount
  useEffect(() => {
    const pendingPhone = localStorage.getItem('pendingVerificationPhone')
    if (pendingPhone) {
      setPhoneNumber(pendingPhone)
      setHasPendingVerification(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register({ name, phoneNumber, password })
      // Save phone number to localStorage for pending verification
      localStorage.setItem('pendingVerificationPhone', phoneNumber)
      setShowOTP(true)
      setHasPendingVerification(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    try {
      await verifyOTP({ phoneNumber, code: otp })
      // Clear pending verification from localStorage on success
      localStorage.removeItem('pendingVerificationPhone')
    } catch (error) {
      console.error(error)
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    try {
      await resendOTP({ phoneNumber })
    } catch (error) {
      console.error(error)
    } finally {
      setResending(false)
    }
  }

  const handleOpenOTPForm = () => {
    setShowOTP(true)
    setHasPendingVerification(false)
  }

  const handleCancelPendingVerification = () => {
    localStorage.removeItem('pendingVerificationPhone')
    setPhoneNumber('')
    setHasPendingVerification(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">م</span>
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
                <h2 className="text-2xl font-bold text-foreground">مرحباً بك!</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                إنشاء حساب جديد. ابدأ رحلتك التوعوية معنا الآن
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: '🚀', title: 'ابدأ فوراً', desc: 'إنشاء حساب في أقل من دقيقة' },
                { icon: '🔒', title: 'آمن وموثوق', desc: 'بيانات آمنة ومحمية تماماً' },
                { icon: '🌟', title: 'مميزات رائعة', desc: 'تمتع بجميع مميزات المنصة' },
              ].map((item, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Pending Verification Alert */}
            <AnimatePresence>
              {hasPendingVerification && !showOTP && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4"
                >
                  <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                            لديك تسجيل غير مكتمل
                          </h3>
                          <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                            رقم الهاتف <span className="font-mono font-bold">{phoneNumber}</span> في انتظار التحقق
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleOpenOTPForm}
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              إدخال رمز التحقق
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-2 pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-center text-foreground">
                  {t('auth.registerTitle')}
                </CardTitle>
                <CardDescription className="text-center text-base">
                  أنشئ حساباً جديداً لتبدأ معنا
                </CardDescription>
              </CardHeader>

              {!showOTP ? (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-5 pb-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">
                        {t('auth.name')}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 text-base"
                        required
                      />
                    </div>

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
                      <Input
                        id="password"
                        type="password"
                        placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 text-base"
                        required
                        minLength={8}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={loading}
                    >
                      {loading ? t('common.loading') : t('auth.registerButton')}
                      {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground">
                          هل لديك حساب بالفعل؟
                        </span>
                      </div>
                    </div>

                    <Link href="/auth/login" className="w-full">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 text-base font-medium"
                      >
                        {t('auth.loginHere')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <CardContent className="space-y-5 pb-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground mb-1">
                            تم إرسال رمز التحقق
                          </p>
                          <p className="text-muted-foreground">
                            أدخل الرمز المرسل إلى رقم {phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-foreground font-medium">
                        رمز التحقق
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="ادخل الرمز"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="h-11 text-center tracking-widest text-2xl font-bold"
                        required
                        maxLength={6}
                        dir="ltr"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={handleResendOTP}
                      disabled={resending}
                    >
                      {resending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                    </Button>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium"
                      disabled={verifying || otp.length !== 6}
                    >
                      {verifying ? 'جاري التحقق...' : 'تحقق من الرمز'}
                      {!verifying && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 text-base font-medium"
                      onClick={() => setShowOTP(false)}
                    >
                      العودة للتسجيل
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>

            <p className="text-sm text-center text-muted-foreground mt-6">
              بالتسجيل تقبل{' '}
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
