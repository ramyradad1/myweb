import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

// Revalidate sitemap every 3600 seconds (1 hour) to reduce unnecessary re-crawls
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://technify.space';
  
  // Fixed date for static pages - update this when you actually change static content
  const staticLastModified = new Date('2026-03-29T00:00:00Z');
  
  // 1. Static Routes (NO /admin - it should never be in sitemap)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticLastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(), // This page genuinely updates often
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Fetch all published articles from Supabase
  let articles: { slug?: string; publishedAt?: string; category?: string }[] = [];
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, publishedAt, category')
      .order('publishedAt', { ascending: false });

    if (!error && data) {
      articles = data;
    }
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error);
  }

  // 3. Dynamic Article Routes (higher priority for recent articles)
  const now = Date.now();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => {
    const pubDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
    const ageInDays = (now - pubDate.getTime()) / (1000 * 60 * 60 * 24);
    // Recent articles get higher priority
    const priority = ageInDays < 7 ? 0.8 : ageInDays < 30 ? 0.7 : 0.6;
    
    return {
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: pubDate,
      changeFrequency: 'weekly' as const,
      priority,
    };
  });

  // 4. Dynamic Categories (Extract unique categories from articles)
  const uniqueCategories = Array.from(new Set(articles.map(a => a.category).filter((cat): cat is string => Boolean(cat))));

  const categoryRoutes: MetadataRoute.Sitemap = uniqueCategories.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}

