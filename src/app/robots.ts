import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://technify.space';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/articles/',
          '/category/',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/admin/',
          '/api/cron/',
          '/api/indexnow/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
