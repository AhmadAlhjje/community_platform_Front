import { Navbar } from '@/components/navbar'

export default function PollsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-4 px-4 sm:py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
