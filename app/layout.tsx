import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'منصة تعزيز الوعي المجتمعي',
  description: 'منصة تفاعلية لتعزيز الوعي المجتمعي من خلال المقالات والألعاب التفاعلية',
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
