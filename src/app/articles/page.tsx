'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import ArticleCard from '@/components/ArticleCard';
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



export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Technology', 'Business', 'Science', 'Culture', 'Design'];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data: snapshot, error } = await supabase
          .from('articles')
          .select('*')
          .order('publishedAt', { ascending: false });
        
        if (error) throw error;
        
        if (snapshot && snapshot.length > 0) {
          const loaded: Article[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          snapshot.forEach((data: any) => {
            const pubDate = data.publishedAt ? new Date(data.publishedAt) : null;
            const dateStr = pubDate ? pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';
            const contentStr = typeof data.content === 'string' ? data.content : '';
            const contentLength = contentStr.length;
            const readMins = Math.max(3, Math.ceil(contentLength / 1200));
            const excerpt = data.metaDescription || contentStr.replace(/<[^>]*>/g, '').substring(0, 160) + '...' || data.title;

            loaded.push({
              id: data.id,
              title: data.title || 'Untitled',
              excerpt,
              imageUrl: data.heroImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
              category: data.category || 'Technology',
              date: dateStr,
              readTime: `${readMins} min read`,
              slug: data.slug || data.id,
            });
          });
          setArticles(loaded);
          setFiltered(loaded);
        } else {
          setArticles([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setArticles([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let result = articles;
    if (activeCategory !== 'All') {
      result = result.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const lq = searchQuery.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(lq));
    }
    setFiltered(result);
  }, [activeCategory, searchQuery, articles]);

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
        <div className={styles.filtersBar}>
          <div className={styles.categories}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Search articles..." 
              className={styles.searchInput} 
              dir="ltr"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>Loading articles...</div>
        ) : (
          <div className={styles.articlesGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyGridState}>
                No articles found matching your criteria.
              </div>
            ) : (
              filtered.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
