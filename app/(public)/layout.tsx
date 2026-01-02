import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://sotonayabni.org',
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
