'use client';

import { useState } from 'react';
import styles from '@/app/articles/page.module.css';
import ArticleCard from '@/components/ArticleCard';

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

interface ArticlesFilterProps {
  articles: Article[];
}

export default function ArticlesFilter({ articles }: ArticlesFilterProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Technology', 'Business', 'Science', 'Culture', 'Design'];

  let filtered = articles;
  if (activeCategory !== 'All') {
    filtered = filtered.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
  }
  if (searchQuery.trim()) {
    const lq = searchQuery.toLowerCase();
    filtered = filtered.filter(a => a.title.toLowerCase().includes(lq));
  }

  return (
    <>
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
    </>
  );
}
