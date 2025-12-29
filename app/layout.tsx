import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sotonayabni.org'),
  title: {
    default: 'صوتنا يبني - منصة تفاعلية للوعي المجتمعي',
    template: '%s | صوتنا يبني'
  },
  description: 'منصة تفاعلية عربية لتعزيز الوعي المجتمعي من خلال المقالات التعليمية، الألعاب التفاعلية، والاستطلاعات. شارك برأيك واكسب النقاط وتنافس مع الآخرين.',
  keywords: [
    'صوتنا يبني',
    'منصة تفاعلية',
    'وعي مجتمعي',
    'مقالات تعليمية',
    'ألعاب تفاعلية',
    'استطلاعات رأي',
    'مجتمع عربي',
    'تعليم',
    'ثقافة',
    'نقاط ومكافآت',
    'لوحة المتصدرين',
    'Sotona Yabni',
    'community platform',
    'interactive learning'
  ],
  authors: [{ name: 'فريق صوتنا يبني' }],
  creator: 'صوتنا يبني',
  publisher: 'صوتنا يبني',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: '/',
    title: 'صوتنا يبني - منصة تفاعلية للوعي المجتمعي',
    description: 'منصة تفاعلية عربية لتعزيز الوعي المجتمعي من خلال المقالات التعليمية، الألعاب التفاعلية، والاستطلاعات.',
    siteName: 'صوتنا يبني',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'صوتنا يبني - منصة تفاعلية للوعي المجتمعي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'صوتنا يبني - منصة تفاعلية للوعي المجتمعي',
    description: 'منصة تفاعلية عربية لتعزيز الوعي المجتمعي من خلال المقالات التعليمية، الألعاب التفاعلية، والاستطلاعات.',
    images: ['/images/logo.png'],
  },
  verification: {
    google: 'google12c06702117378ee',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="overflow-x-hidden">
      <body className="font-sans antialiased flex flex-col min-h-screen overflow-x-hidden">
        <ThemeProvider>
          <div className="flex-1 overflow-x-hidden">
            {children}
          </div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
