'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null; // Don't show on admin pages

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>Technify</span>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={pathname === '/' ? styles.activeLink : styles.link}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/articles" className={pathname === '/articles' ? styles.activeLink : styles.link}>
              Latest News
            </Link>
          </li>
          <li>
            <Link href="/category/Technology" className={pathname?.startsWith('/category') ? styles.activeLink : styles.link}>
              Topics
            </Link>
          </li>
          <li>
            <Link href="/about" className={pathname === '/about' ? styles.activeLink : styles.link}>
              About Us
            </Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          {/* Admin link hidden from public view to maintain editorial facade */}
        </div>
      </div>
    </nav>
  );
}
