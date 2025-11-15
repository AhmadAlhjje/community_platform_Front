export function formatDate(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`
}

export function getTimeRemaining(endDate: string | Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
} {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isExpired: false }
}
