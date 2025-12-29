import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sotonayabni.org'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/how-it-works',
    '/privacy',
    '/terms',
    '/community-guidelines',
    '/articles',
    '/games',
    '/polls/results',
    '/leaderboard',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticPages]
}
