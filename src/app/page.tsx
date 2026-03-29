import { Metadata } from 'next';
import Link from 'next/link';
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

// Revalidate every 60 seconds so Google always sees fresh content
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Technify | Premium Editorial & Global News',
  description: 'A premier digital magazine delivering expert-curated news, insights, and analysis across technology, business, and health tailored for the modern professional.',
  openGraph: {
    title: 'Technify | Premium Editorial Excellence',
    description: 'Expert-curated global news and technology insights.',
    url: 'https://technify.space',
    siteName: 'Technify',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Technify Editorial',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technify | Premium Editorial',
    description: 'A premier digital magazine delivering expert-curated analysis and insights.',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&q=80'],
  },
};

async function getLatestArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('publishedAt', { ascending: false })
      .limit(3);

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
          category: article.category || 'Technology',
          date: dateStr,
          readTime: `${readMins} min read`,
          slug: article.slug || article.id,
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch latest articles:', err);
  }
  return [];
}

export default async function Home() {
  const latestArticles = await getLatestArticles();

  const siteNavigationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    'hasPart': [
      { '@type': 'WebPage', 'name': 'Articles', 'url': 'https://technify.space/articles' },
      { '@type': 'WebPage', 'name': 'Technology', 'url': 'https://technify.space/category/Technology' },
      { '@type': 'WebPage', 'name': 'Business', 'url': 'https://technify.space/category/Business' },
      { '@type': 'WebPage', 'name': 'About Us', 'url': 'https://technify.space/about' }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>✨ Premium Editorial Excellence</div>
          <h1 className={styles.title}>
            Uncovering Truth <br />
            with <span className={styles.titleHighlight}>Technify</span>
          </h1>
          <p className={styles.subtitle}>
            A premium editorial magazine delivering expert-curated analysis, global news, and deep insights across technology, business, and health tailored for the modern professional.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/articles" className="btn btn-primary">
              Explore Latest Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>342+</span>
              <span className={styles.statLabel}>Published Features</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>1.2M</span>
              <span className={styles.statLabel}>Monthly Readers</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Original Analysis</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Global Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Editorial Process */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Editorial Process</h2>
          <p className={styles.subtitle}>Three steps to delivering unparalleled quality journalism</p>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>1</div>
            <h3 className={styles.cardTitle}>Global Sourcing</h3>
            <p className={styles.cardDesc}>
              Our research network monitors top global sources around the clock to bring you the most critical stories before they go mainstream.
            </p>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardIcon}>2</div>
            <h3 className={styles.cardTitle}>Expert Curation</h3>
            <p className={styles.cardDesc}>
              Our senior editors carefully analyze and synthesize complex information, stripping away the noise to uncover actionable insights.
            </p>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardIcon}>3</div>
            <h3 className={styles.cardTitle}>Daily Publishing</h3>
            <p className={styles.cardDesc}>
              We publish fresh, objective analysis every day, tailored specifically for professionals who need to stay ahead of the curve.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className={styles.articlesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Editorial Insights</h2>
          <p className={styles.subtitle}>Premium content published daily to keep you informed</p>
        </div>
        <div className={styles.grid}>
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
        <div className={styles.centerBtn}>
           <Link href="/articles" className="btn btn-primary">
             View All Articles →
           </Link>
         </div>
      </section>

      {/* Newsletter CTA */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterBox}>
            <h2 className={styles.sectionTitle}>📬 Join Our Premium Newsletter</h2>
            <p className={styles.subtitle}>Get exclusive insights delivered directly to your inbox every morning.</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email address..." className={styles.newsletterInput} dir="ltr" />
              <button type="submit" className="btn btn-primary">Subscribe Now</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
