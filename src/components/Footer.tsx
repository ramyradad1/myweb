import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <h3 className={styles.brandTitle}>
              <span className={styles.brandIcon}>⚡</span> Technify
            </h3>
            <p className={styles.brandDesc}>
              A premium editorial magazine delivering expert-curated analysis, global news, and deep insights across technology, business, and health.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/articles">Latest News</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={styles.columnTitle}>Categories</h4>
            <ul className={styles.linkList}>
              <li><Link href="/category/Technology">Technology</Link></li>
              <li><Link href="/category/Business">Business</Link></li>
              <li><Link href="/category/Health">Health</Link></li>
              <li><Link href="/category/Marketing">Marketing</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={styles.columnTitle}>Newsletter</h4>
            <p className={styles.newsletterDesc}>Subscribe for our premium daily insights.</p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email address..."
                className={styles.emailInput}
                dir="ltr"
              />
              <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Technify — All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
