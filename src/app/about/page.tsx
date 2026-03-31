import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us | Technify',
  description: 'Learn about Technify, a premium editorial platform delivering expert-curated analysis daily.',
  alternates: {
    canonical: 'https://technify.space/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>About Us 🚀</h1>
          <p className={styles.subtitle}>
            The story of Technify and how we are redefining digital journalism.
          </p>
        </div>
      </header>

      <main className="container">
        {/* Mission */}
        <section className={styles.section}>
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.text}>
              At Technify, we believe that modern professionals deserve content that meets the highest standards of quality and objectivity. That&apos;s why we&apos;ve built a global editorial network that curates the most important insights, guaranteeing exclusive, unique, and deeply analytical journalism across technology, business, and health sectors.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Editorial Approach</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h3>Global Monitoring</h3>
              <p>Our research network monitors the best global sources in real-time to capture breaking news and deeper macro trends.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h3>Expert Synthesis</h3>
              <p>Our editorial team synthesizes multiple viewpoints to provide comprehensive, uniquely structured analysis tailored for a sophisticated audience.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h3>Rigorous Verification</h3>
              <p>Before publication, every piece undergoes a rigorous originality and fact-checking process to ensure 100% unique and accurate insights.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>04</div>
              <h3>Seamless Delivery</h3>
              <p>Content is published globally with optimized metadata, enabling professionals around the world to find information effortlessly.</p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Infrastructure</h2>
          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <span className={styles.techIcon}>⚡</span>
              <h4>Next.js 15</h4>
              <p>Lightning-fast platform architecture built for performance.</p>
            </div>
            <div className={styles.techCard}>
              <span className={styles.techIcon}>🤖</span>
              <h4>Advanced Modeling</h4>
              <p>State-of-the-art data modeling to capture deep insights.</p>
            </div>
            <div className={styles.techCard}>
              <span className={styles.techIcon}>🔥</span>
              <h4>Enterprise Database</h4>
              <p>Secure, scalable, and real-time content delivery.</p>
            </div>
            <div className={styles.techCard}>
              <span className={styles.techIcon}>📊</span>
              <h4>Global SEO</h4>
              <p>Modern reach capabilities targeting the US and beyond.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
