import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import ArticleReactions from '@/components/reactions/ArticleReactions';
import CommentSection from '@/components/comments/CommentSection';
import CopyableArticleBody from '@/components/CopyableArticleBody';
import { marked } from 'marked';

// Define the expected params for Next.js App Router
type Props = {
  params: Promise<{ slug: string }>;
};

// Fallback article logic (moved to server side)
const fallbackArticle = (slug: string) => ({
  id: '00000000-0000-0000-0000-000000000000',
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
  isoDate: new Date().toISOString(),
  reaction_like: 0,
  reaction_love: 0,
  reaction_mindblown: 0
});

// Fetch article data (Server-side)
async function getArticle(slug: string) {
  try {
    // Try fetching by slug
    let { data: rows } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .limit(1);

    // If no match by slug, try fetching by id (UUID)
    if (!rows || rows.length === 0) {
      if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug)) {
        const { data: byId } = await supabase
          .from('articles')
          .select('*')
          .eq('id', slug)
          .limit(1);
        rows = byId;
      }
    }

    if (rows && rows.length > 0) {
      const data = rows[0];
      const pubDate = data.publishedAt ? new Date(data.publishedAt as string) : null;
      const dateStr = pubDate
        ? pubDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Recent';
        
      const isoStr = pubDate ? pubDate.toISOString() : new Date().toISOString();

      let htmlContent = '';
      if (data.content && typeof data.content === 'string' && data.content.trim().length > 0) {
        htmlContent = await marked.parse(data.content, { gfm: true, breaks: true });
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
      // Extract a text-only description for meta tags
      const plainTextContent = htmlContent.replace(/<[^>]+>/g, '').trim();
      const metaDescription = plainTextContent.substring(0, 150) + '...';

      return {
        id: data.id,
        title: data.title || 'Untitled',
        category: data.category || 'Technology',
        author: data.author || 'Technify Editorial',
        date: dateStr,
        readTime: `${readMins} min read`,
        imageUrl: data.heroImage || data.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        content: htmlContent || '<p>Content is being prepared...</p>',
        metaDescription,
        tags: data.tags || [data.category || 'Technology'],
        isoDate: isoStr,
        wordCount: plainTextContent.split(/\s+/).length,
        reaction_like: data.reaction_like || 0,
        reaction_love: data.reaction_love || 0,
        reaction_mindblown: data.reaction_mindblown || 0
      };
    }
  } catch (error) {
    console.error('Failed to fetch article server-side:', error);
  }
  
  // Return fallback if database fails (prevents 404s for mocked slugs)
  if (slug === 'future-of-ai-2026' || slug === 'seo-strategies-arabic-content') {
    const fb = fallbackArticle(slug);
    return {
      ...fb,
      metaDescription: fb.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
      wordCount: 850
    };
  }
  
  return null;
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: article.title,
    description: article.metaDescription,
    authors: [{ name: article.author }],
    category: article.category,
    keywords: [...article.tags, article.category, 'Technify'],
    alternates: {
      canonical: `https://technify.space/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://technify.space/articles/${slug}`,
      siteName: 'Technify',
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: article.isoDate,
      modifiedTime: article.isoDate, // Update this if you add an updated_at field
      authors: [article.author],
      tags: article.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [article.imageUrl],
      creator: '@technify',
    },
  };
}

// Server Component
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Enhanced JSON-LD Schema (AdSense Ready)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: [article.imageUrl],
    datePublished: article.isoDate,
    dateModified: article.isoDate, // Update if you have modified date
    author: {
      '@type': 'Person', // More accurate than Organization for individuals
      name: article.author,
      url: `https://technify.space/author/${encodeURIComponent(article.author.toLowerCase().replace(/\\s+/g, '-'))}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Technify',
      logo: {
        '@type': 'ImageObject',
        url: 'https://technify.space/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://technify.space/articles/${slug}`
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    wordCount: article.wordCount,
    inLanguage: 'en-US'
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

      <CopyableArticleBody content={article.content} />

      <div className={styles.tagsContainer}>
        <span className={styles.tagLabel}>Tags:</span>
        {article.tags.map((tag: string) => (
          <Link 
            key={tag} 
            href={`/category/${encodeURIComponent(tag.toLowerCase())}`} 
            className={styles.tag}
          >
            {tag}
          </Link>
        ))}
      </div>

      <ArticleReactions 
        articleId={article.id} 
        initialCounts={{
          like: article.reaction_like,
          love: article.reaction_love,
          mindblown: article.reaction_mindblown
        }} 
      />

      <CommentSection articleId={article.id} />
    </article>
  );
}

