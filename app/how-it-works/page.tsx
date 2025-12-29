'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Gamepad2, MessageSquare, Mail, Heart, CheckCircle2, Trophy, MessageCircle, Phone, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { PublicNavbar } from '@/components/public-navbar'

export default function HowItWorksPage() {
  const { user } = useAuth()
  const features = [
    {
      icon: BookOpen,
      title: 'قراءة المقالات',
      description: 'اقرأ المقالات المتنوعة واستفد من المحتوى القيم',
      steps: [
        'اختر مقالاً يهمك من المقالات المتاحة',
        'اقرأ المقال بتمعن واستوعب المحتوى',
        'أجب على الاختبار القصير بعد القراءة',
        'احصل على نقاط إذا كانت إجاباتك صحيحة بنسبة 70% أو أكثر',
        'تضاف النقاط تلقائياً إلى ملفك الشخصي'
      ]
    },
    {
      icon: Gamepad2,
      title: 'الألعاب التعليمية',
      description: 'استمتع بالألعاب التفاعلية واكسب النقاط',
      steps: [
        'اختر لعبة من الألعاب المتاحة (كلمات متقاطعة، بازل)',
        'العب وحاول إكمال اللعبة بنجاح',
        'عند الفوز، ستظهر لك رسالة تحفيزية',
        'تضاف النقاط المكتسبة إلى رصيدك',
        'تابع تقدمك في لوحة المتصدرين'
      ]
    },
    {
      icon: MessageSquare,
      title: 'استطلاعات الرأي',
      description: 'شارك برأيك وكن جزءاً من النقاش',
      steps: [
        'شارك في الاستطلاعات المتاحة بالتصويت',
        'قد يتم عقد جلسة حوار بعد الاستطلاع لمناقشة النتائج',
        'إذا تم تحديد جلسة حوار، ستصلك رسالة عبر الواتساب',
        'شارك في الجلسة واطرح أفكارك ومقترحاتك',
        'ساهم في إيجاد حلول للقضايا المطروحة'
      ]
    }
  ]

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            كيف تعمل المنصة؟
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
            منصة تفاعلية تجمع بين التعلم والترفيه والمشاركة المجتمعية. تعرف على كيفية الاستفادة من جميع المزايا
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <p className="text-base font-medium">
              مبادرة شبابية يقودها فريق من الشباب الطموح لبناء مجتمع واعٍ ومتفاعل
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <div className="space-y-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/30">
                        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mr-16">
                      {feature.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Youth Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">دور الشباب في المنصة</h2>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  نحن فريق من الشباب الطموح الذين يؤمنون بقدرة الشباب على التغيير والتأثير الإيجابي في المجتمع.
                  نعمل معاً كفريق واحد لتوفير منصة تفاعلية تساهم في نشر الوعي والمعرفة.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm">الشباب هم قادة التغيير والمستقبل</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm">نعمل كفريق شبابي متكامل لتحقيق أهدافنا المشتركة</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm">نؤمن بأهمية مشاركة الشباب في بناء مجتمع أفضل</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm">المنصة من الشباب وللشباب والمجتمع بأكمله</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact & Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-blue-200 dark:border-blue-800 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold">تواصل معنا</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  لديك اقتراحات للتطوير؟ تحتاج إلى مساعدة؟ فريقنا الشبابي هنا لخدمتك والاستماع لأفكارك
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">تجدنا عبر البريد الإلكتروني</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">أو عبر الهاتف</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">فريق شبابي يرحب بكل مقترحاتكم</span>
                  </div>
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                    اذهب إلى صفحة التواصل
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Platform */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2 border-blue-200 dark:border-blue-800 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                    <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold">دعم المنصة</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  نحن فريق شبابي متطوع نعمل على توفير محتوى مجاني وقيم للجميع. مساهمتك تساعدنا على الاستمرار والتطور
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">دعم استدامة المنصة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">تطوير محتوى جديد</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">تحسين تجربة المستخدم</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-muted-foreground">تمكين الفريق الشبابي من خدمة المجتمع</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  نقبل التبرعات لدعم استدامة المنصة وتطويرها بشكل مستمر. كل دعمكم يساعدنا كفريق شبابي في تقديم الأفضل. شكراً لدعمكم الكريم
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Points System Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold">نظام النقاط</h2>
              </div>
              <p className="text-center text-muted-foreground max-w-3xl mx-auto">
                اكسب النقاط من خلال قراءة المقالات والإجابة على الاختبارات بنجاح، أو عن طريق الفوز بالألعاب التعليمية.
                تابع تقدمك في لوحة المتصدرين وتنافس مع المستخدمين الآخرين! كل نقطة تعكس مشاركتك الفعالة في بناء مجتمع معرفي أفضل.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </>
  )
}
