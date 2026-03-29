import { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import styles from '@/app/articles/page.module.css';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

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

type Props = {
  params: Promise<{ name: string }>;
};

// Dynamic Metadata for each category
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/-/g, ' ');
  return {
    title: `${decodedName} Articles`,
    description: `Browse all ${decodedName} articles and news on Technify — expert-curated analysis and insights.`,
    alternates: {
      canonical: `/category/${name}`,
    },
    openGraph: {
      title: `${decodedName} | Technify`,
      description: `Latest ${decodedName} news, analysis, and expert insights from Technify.`,
      siteName: 'Technify',
      type: 'website',
    },
  };
}

async function getCategoryArticles(categoryName: string): Promise<Article[]> {
  const decodedName = decodeURIComponent(categoryName).replace(/-/g, ' ');

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', decodedName)
      .order('publishedAt', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((article: any) => {
        const pubDate = article.publishedAt ? new Date(article.publishedAt) : null;
        const dateStr = pubDate ? pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';
        const contentStr = typeof article.content === 'string' ? article.content : '';
        const contentLength = contentStr.length;
        const readMins = Math.max(3, Math.ceil(contentLength / 1200));
        const excerpt = article.metaDescription || contentStr.replace(/<[^>]*>/g, '').substring(0, 160) + '...' || article.title;

        return {
          id: article.id,
          title: article.title || 'Untitled',
          excerpt,
          imageUrl: article.heroImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
          category: article.category || decodedName,
          date: dateStr,
          readTime: `${readMins} min read`,
          slug: article.slug || article.id,
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch category articles:', err);
  }
  return [];
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/-/g, ' ');
  const articles = await getCategoryArticles(name);

  // JSON-LD for category page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${decodedName} Articles`,
    description: `All ${decodedName} articles on Technify`,
    url: `https://technify.space/category/${name}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Technify',
      url: 'https://technify.space'
    }
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://technify.space'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': decodedName,
        'item': `https://technify.space/category/${name}`
      }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>{decodedName}</h1>
          <p className={styles.subtitle}>
            All articles and news related to the {decodedName} sector.
          </p>
        </div>
      </header>

      <main className="container">
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
      </main>
    </div>
  );
}
