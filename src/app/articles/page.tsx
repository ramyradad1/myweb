import { Metadata } from 'next';
import styles from './page.module.css';
import ArticlesFilter from '@/components/ArticlesFilter';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse all premium editorial articles from Technify — expert-curated analysis on technology, business, and health.',
  alternates: {
    canonical: '/articles',
  },
};

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

async function getAllArticles(): Promise<Article[]> {
  try {
    const { data: snapshot, error } = await supabase
      .from('articles')
      .select('*')
      .order('publishedAt', { ascending: false });
    
    if (error) throw error;
    
    if (snapshot && snapshot.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return snapshot.map((data: any) => {
        const pubDate = data.publishedAt ? new Date(data.publishedAt) : null;
        const dateStr = pubDate ? pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';
        const contentStr = typeof data.content === 'string' ? data.content : '';
        const contentLength = contentStr.length;
        const readMins = Math.max(3, Math.ceil(contentLength / 1200));
        const excerpt = data.metaDescription || contentStr.replace(/<[^>]*>/g, '').substring(0, 160) + '...' || data.title;

        return {
          id: data.id,
          title: data.title || 'Untitled',
          excerpt,
          imageUrl: data.heroImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
          category: data.category || 'Technology',
          date: dateStr,
          readTime: `${readMins} min read`,
          slug: data.slug || data.id,
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch articles:', err);
  }
  return [];
}

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>The Editorial Vault</h1>
          <p className={styles.subtitle}>
            Thousands of exclusive articles, constantly updated and curated by our global editorial network.
          </p>
        </div>
      </header>

      <main className="container">
        <ArticlesFilter articles={articles} />
      </main>
    </div>
  );
}
