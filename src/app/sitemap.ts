import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://articleforge.com'; // Change back to real domain
  
  // Static Routes
  const routes = [
    '',
    '/articles',
    '/admin',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Mock Dynamic Routes (Will be replaced with DB fetch)
  const articles = [
    'future-of-ai-2026',
    'seo-strategies-arabic-content'
  ].map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categories = [
    'تكنولوجيا',
    'أعمال'
  ].map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...routes, ...articles, ...categories];
}
