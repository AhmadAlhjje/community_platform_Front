import { Navbar } from '@/components/navbar'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">{children}</main>
    </div>
  )
}
