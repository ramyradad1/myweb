'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import styles from '@/app/articles/page.module.css';
import { supabase } from '@/lib/supabase';
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

export default function CategoryPage() {
  const params = useParams();
  const rawName = params?.name as string || '';
  const decodedName = decodeURIComponent(rawName).replace(/-/g, ' ');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!decodedName) return;

    const fetchCategoryArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('category', decodedName)
          .order('publishedAt', { ascending: false });

        if (error) throw error;
          
        if (data && data.length > 0) {
          const loaded: Article[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.forEach((article: any) => {
            const pubDate = article.publishedAt ? new Date(article.publishedAt) : null;
            const dateStr = pubDate ? pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';
            const contentStr = typeof article.content === 'string' ? article.content : '';
            const contentLength = contentStr.length;
            const readMins = Math.max(3, Math.ceil(contentLength / 1200));
            const excerpt = article.metaDescription || contentStr.replace(/<[^>]*>/g, '').substring(0, 160) + '...' || article.title;

            loaded.push({
              id: article.id,
              title: article.title || 'Untitled',
              excerpt,
              imageUrl: article.heroImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
              category: article.category || decodedName,
              date: dateStr,
              readTime: `${readMins} min read`,
              slug: article.slug || article.id,
            });
          });
          setArticles(loaded);
        } else {
          // Fallback mock articles for this category
          setArticles([
            {
              id: '1',
              title: `A Comprehensive Guide to ${decodedName}`,
              excerpt: `Explore the latest developments and news related to the ${decodedName} field through rich, meticulously curated articles.`,
              imageUrl: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=500&q=80',
              category: decodedName,
              date: 'March 25, 2026',
              readTime: '4 min read',
              slug: `guide-to-${rawName}`
            },
            {
              id: '2',
              title: `How Innovation is Reshaping ${decodedName}`,
              excerpt: `A deep analysis of the continuous technological impact on ${decodedName} and what to expect in the near future.`,
              imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
              category: decodedName,
              date: 'March 24, 2026',
              readTime: '7 min read',
              slug: `innovation-and-${rawName}`
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch category articles:', err);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [decodedName, rawName]);

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>{decodedName}</h1>
          <p className={styles.subtitle}>
            All articles and news related to the {decodedName} sector.
          </p>
        </div>
      </header>

      <main className="container">
        {isLoading ? (
          <div className={styles.emptyState}>Loading articles...</div>
        ) : (
          <div className={styles.articlesGrid}>
            {articles.length === 0 ? (
              <div className={styles.emptyGridState}>
                No articles found in this category yet.
              </div>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
