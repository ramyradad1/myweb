'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface ArticleData {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  content: string;
  tags: string[];
  isoDate: string;
}

const fallbackArticle = (slug: string): ArticleData => ({
  title: `The Bright Future of ${slug.replace(/-/g, ' ')}`,
  category: 'Technology',
  author: 'Senior Editor',
  date: 'March 24, 2026',
  readTime: '6 min read',
  imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  content: `
    <p>This is the introduction to our exclusive editorial piece. This content has been meticulously researched and synthesized to ensure true value is delivered to the reader, guaranteeing 100% unique insights to dominate Google search results.</p>
    
    <h2>The Importance of the Subject Today</h2>
    <p>Given the rapid developments, we find that this field is growing at a tremendous pace. Modern technologies have sparked a true revolution in how we work and interact with the world around us.</p>
    
    <blockquote>True innovation does not lie in creating something from absolute nothingness, but in connecting the dots in a way never seen before.</blockquote>
    
    <h3>How Can We Leverage This Technology?</h3>
    <ul>
      <li>Improving productivity in daily workflows.</li>
      <li>Automating routine and tedious tasks.</li>
      <li>Opening new horizons for innovation and solving complex problems.</li>
    </ul>
    
    <p>In conclusion, adopting these technologies is no longer just a luxury; it is a necessity to remain competitive in today's market.</p>
  `,
  tags: ['Innovation', 'Future Tech', 'Automation', 'Business'],
  isoDate: new Date().toISOString()
});

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string || '';
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        // Try fetching by slug
        const { data: rows, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .limit(1);

        if (error) throw error;

        // If no match by slug, try fetching by id
        let articles = rows || [];
        if (articles.length === 0) {
          const { data: byId } = await supabase
            .from('articles')
            .select('*')
            .eq('id', slug)
            .limit(1);
          if (byId && byId.length > 0) articles = byId;
        }

        if (articles && articles.length > 0) {
          const data = articles[0];
          const pubDate = data.publishedAt ? new Date(data.publishedAt as string) : null;
          const dateStr = pubDate
            ? pubDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Recent';
            
          const isoStr = pubDate ? pubDate.toISOString() : new Date().toISOString();

          // Read content: prefer direct HTML content field, fallback to blocks
          let htmlContent = '';
          if (data.content && typeof data.content === 'string' && data.content.trim().length > 0) {
            htmlContent = data.content;
          } else if (data.blocks && Array.isArray(data.blocks)) {
            for (const block of data.blocks) {
              if (block.type === 'heading') {
                htmlContent += `<h2>${block.content}</h2>`;
              } else if (block.type === 'paragraph') {
                htmlContent += `<p>${block.content}</p>`;
              } else if (block.type === 'image') {
                htmlContent += `<figure><img src="${block.url}" alt="${block.alt || ''}" style="max-width:100%;border-radius:8px;margin:1rem 0" />${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}</figure>`;
              } else if (block.type === 'list') {
                htmlContent += `<ul>${(block.items || []).map((item: string) => `<li>${item}</li>`).join('')}</ul>`;
              } else if (block.type === 'blockquote') {
                htmlContent += `<blockquote>${block.content}</blockquote>`;
              }
            }
          }

          const contentLength = htmlContent.length;
          const readMins = Math.max(3, Math.ceil(contentLength / 1200));

          setArticle({
            title: data.title || 'Untitled',
            category: data.category || 'Technology',
            author: data.author || 'Technify Editorial',
            date: dateStr,
            readTime: `${readMins} min read`,
            imageUrl: data.heroImage || data.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
            content: htmlContent || '<p>Content is being prepared...</p>',
            tags: data.tags || [data.category || 'Technology'],
            isoDate: isoStr,
          });
        } else {
          setArticle(fallbackArticle(slug));
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setArticle(fallbackArticle(slug));
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading || !article) {
    return (
      <div className={styles.articleLoading}>
        Loading article...
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.imageUrl,
    datePublished: article.isoDate,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Technify',
      logo: {
        '@type': 'ImageObject',
        url: 'https://technify.space/logo.png'
      }
    }
  };

  return (
    <article className={styles.articleContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className={styles.articleHeader}>
        <div className={styles.categoryBadge}>{article.category}</div>
        <h1 className={styles.title}>{article.title}</h1>
        
        <div className={styles.metaInfo}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}></div>
            <span>{article.author}</span>
          </div>
          <span>📅 {article.date}</span>
          <span>⏱️ {article.readTime}</span>
        </div>
      </header>

      <div className={styles.heroImageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className={styles.heroImage} />
      </div>

      <div 
        className={styles.articleBody}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className={styles.tagsContainer}>
        <span className={styles.tagLabel}>Tags:</span>
        {article.tags.map(tag => (
          <Link 
            key={tag} 
            href={`/category/${encodeURIComponent(tag.toLowerCase())}`} 
            className={styles.tag}
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
