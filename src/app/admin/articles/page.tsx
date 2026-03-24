'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { supabase } from '../../../lib/supabase';
import styles from '../admin.module.css';

interface ArticleData {
  id: string;
  title: string;
  category: string;
  views: number;
  status: string;
  date: string;
}

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function fetchArticles() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('publishedAt', { ascending: false });
      
      if (error) throw error;

      const loaded: ArticleData[] = (data || []).map(item => {
        let pubDate = 'Unknown';
        if (item.publishedAt) {
          pubDate = new Date(item.publishedAt as string).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          });
        }
        return {
          id: item.id,
          title: (item.title as string) || 'Untitled',
          category: (item.category as string) || 'Uncategorized',
          views: (item.views as number) || 0,
          status: (item.status as string) || 'published',
          date: pubDate
        };
      });
      
      setArticles(loaded);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin');
      } else {
        fetchArticles();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const lowerQ = searchQuery.toLowerCase();
    return articles.filter(a => a.title.toLowerCase().includes(lowerQ));
  }, [searchQuery, articles]);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) throw error;
        setArticles(prev => prev.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete article");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.adminContainer}>
         <div className={`${styles.mainContent} ${styles.centerLoading}`}>
            Loading articles...
         </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Technify CMS</h2>
          <span className={styles.sidebarSubtitle}>Editorial Workspace</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            📊 Overview
          </Link>
          <Link href="/admin/articles" className={styles.navLinkActive}>
            📝 Articles
          </Link>
          <Link href="/admin/bot" className={styles.navLink}>
            🤖 Editorial Engine
          </Link>
          <Link href="/" className={styles.backLink}>
            🌐 Back to Site
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Article Management</h1>
            <p className={styles.headerSubtitle}>Complete control over published pieces and drafts.</p>
          </div>
          <Link href="/admin/articles/new" className="btn btn-primary">
            + New Article
          </Link>
        </header>

        <div className={`glass-panel ${styles.tableContainer}`}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Article Inventory</h2>
            <input 
              type="text" 
              placeholder="Search by title..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Title</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Views</th>
                <th className={styles.th}>Publish Date</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No articles found.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.id} className={styles.tr}>
                    <td className={styles.tdTitle}>{article.title}</td>
                    <td className={styles.td}>{article.category}</td>
                    <td className={styles.td}>{article.views}</td>
                    <td className={styles.tdDate}>{article.date}</td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${article.status === 'published' ? styles.statusPublished : styles.statusDraft}`}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Link 
                        href={`/admin/articles/edit/${article.id}`} 
                        className={`${styles.actionBtn} ${styles.actionEdit} ${styles.actionEditLink}`}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id, article.title)}
                        className={`${styles.actionBtn} ${styles.actionDelete}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
