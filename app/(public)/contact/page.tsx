'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { PublicNavbar } from '@/components/public-navbar'
import { useToast } from '@/hooks/use-toast'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  MessageCircle,
  Clock
} from 'lucide-react'

const ContactInfo = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative bg-card border rounded-xl p-6 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-3">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
)

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'تم الإرسال بنجاح',
        description: 'شكراً لتواصلك معنا، سيتم الرد عليك قريباً',
      })

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      description: 'ahmadobadaalhjje@gmail.com'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      description: '+9639912345678'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      description: 'سوريا _ حلب'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      description: 'من الأحد إلى الخميس، 9ص - 5م'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="container relative px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              تواصل معنا
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              نود سماع آرائك واقتراحاتك. إذا كان لديك أي أسئلة أو تعليقات، فلا تتردد في التواصل معنا.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24">
        <div className="container px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">معلومات التواصل</h2>
            <p className="text-lg text-muted-foreground">
              يمكنك التواصل معنا بعدة طرق
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <ContactInfo key={index} {...info} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">أسئلة شائعة</h2>
            <p className="text-lg text-muted-foreground">
              إجابات على الأسئلة الشائعة
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-3xl">
            {[
              {
                q: 'كم وقت يستغرق الرد على رسائلي؟',
                a: 'نحاول الرد على جميع الرسائل خلال 24 ساعة'
              },
              {
                q: 'هل هناك رسوم للاشتراك في المنصة؟',
                a: 'المنصة مجانية تماماً للاستخدام'
              },
              {
                q: 'كيف يمكنني الإبلاغ عن مشكلة أو خطأ؟',
                a: 'يمكنك التواصل معنا مباشرة من خلال البريد الإلكتروني او رقم الهاتف'
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border rounded-xl p-6 group hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 منصة صوتنا يبني. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
