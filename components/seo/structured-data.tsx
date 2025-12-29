import Script from 'next/script'

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'article' | 'game'
  data?: any
}

export function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sotonayabni.org'

    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'صوتنا يبني',
          alternateName: 'Sotona Yabni',
          url: baseUrl,
          description: 'منصة تفاعلية عربية لتعزيز الوعي المجتمعي من خلال المقالات التعليمية، الألعاب التفاعلية، والاستطلاعات',
          inLanguage: 'ar',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        }

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'صوتنا يبني',
          alternateName: 'Sotona Yabni',
          url: baseUrl,
          logo: `${baseUrl}/images/logo.png`,
          description: 'منصة تفاعلية عربية لتعزيز الوعي المجتمعي',
          sameAs: [
            // أضف روابط السوشيال ميديا هنا
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@sotonayabni.org'
          }
        }

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data?.title,
          description: data?.description,
          image: data?.image,
          author: {
            '@type': 'Organization',
            name: 'صوتنا يبني'
          },
          publisher: {
            '@type': 'Organization',
            name: 'صوتنا يبني',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/images/logo.png`
            }
          },
          datePublished: data?.publishedAt,
          dateModified: data?.updatedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data?.url
          }
        }

      case 'game':
        return {
          '@context': 'https://schema.org',
          '@type': 'Game',
          name: data?.title,
          description: data?.description,
          image: data?.image,
          genre: 'Educational',
          gamePlatform: 'Web',
          inLanguage: 'ar',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
