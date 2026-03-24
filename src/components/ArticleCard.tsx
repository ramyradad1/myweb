/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

export default function ArticleCard({
  title,
  excerpt,
  imageUrl,
  category,
  date,
  readTime,
  slug
}: ArticleCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={title} className={styles.image} />
        <span className={styles.category}>{category}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{date}</span>
          <span>⏱️ {readTime}</span>
        </div>
        <h3 className={styles.title}>
          <Link href={`/articles/${slug}`}>{title}</Link>
        </h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <Link href={`/articles/${slug}`} className={styles.readMore}>
          Read More
        </Link>
      </div>
    </div>
  );
}
