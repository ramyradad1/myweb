import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

// Revalidate sitemap every 60 seconds so Google gets fresh URLs
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://technify.space';
  
  // 1. Static Routes (NO /admin - it should never be in sitemap)
  const staticRoutes = [
    '',
    '/articles',
    '/about',
    '/privacy',
    '/terms',
    '/contact'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch all articles from Supabase
  let articles: any[] = [];
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

  // 3. Dynamic Article Routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 4. Dynamic Categories (Extract unique categories from articles)
  const uniqueCategories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));
  // Add some fallback categories if DB is empty
  const categories = uniqueCategories.length > 0 
    ? uniqueCategories 
    : ['Technology', 'AI', 'Business', 'Health'];

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}
