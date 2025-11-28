import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://platform.com',
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
