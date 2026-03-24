'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';
import styles from '../../admin.module.css';

export default function NewArticle() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    imageUrl: '',
    content: '',
    metaDescription: '',
    author: 'Editorial Team'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('articles').insert({
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        metaDescription: formData.metaDescription || formData.title,
        content: formData.content,
        category: formData.category,
        tags: [],
        author: formData.author || 'Editorial Team',
        heroImage: formData.imageUrl || '',
        sourceUrl: 'manual',
        views: 0,
        status: 'published',
      });
      if (error) throw error;
      router.push('/admin/articles');
    } catch (error) {
      console.error("Error adding article:", error);
      alert("Failed to create article.");
      setIsSubmitting(false);
    }
  };

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
            <Link href="/admin/articles" className={`${styles.navLink} ${styles.backLinkArticle}`}>
              &larr; Back to Articles
            </Link>
            <h1 className={styles.headerTitle}>New Article</h1>
            <p className={styles.headerSubtitle}>Publish a new piece manually.</p>
          </div>
        </header>

        <div className={`glass-panel ${styles.formPanel}`}>
          <form onSubmit={handleSubmit} className={styles.formLayout}>
            <div>
              <label className={`${styles.inputLabel} ${styles.inputGroup}`}>Title</label>
              <input 
                type="text" 
                className={styles.inputField} 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="The Future of AI..." 
              />
            </div>
            
            <div className={styles.gridTwoCols}>
              <div>
                <label className={`${styles.inputLabel} ${styles.inputGroup}`}>Category</label>
                <select 
                  className={styles.inputField} 
                  required
                  title="Category"
                  aria-label="Category"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Science">Science</option>
                  <option value="Culture">Culture</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div>
                <label className={`${styles.inputLabel} ${styles.inputGroup}`}>Hero Image URL</label>
                <input 
                  type="url" 
                  className={styles.inputField} 
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className={`${styles.inputLabel} ${styles.inputGroup}`}>Meta Description (SEO)</label>
              <input 
                type="text" 
                className={styles.inputField} 
                value={formData.metaDescription}
                onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                placeholder="A compelling summary for search engines (max 155 chars)" 
                maxLength={155}
              />
            </div>

            <div>
              <label className={`${styles.inputLabel} ${styles.inputGroup}`}>Author Name</label>
              <input 
                type="text" 
                className={styles.inputField} 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder="Editorial Team" 
              />
            </div>

            <div>
              <label className={`${styles.inputLabel} ${styles.inputGroup}`}>Content (Markdown supported)</label>
              <textarea 
                className={`${styles.inputField} ${styles.textareaField}`}
                required 
                rows={12}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Write your article content here..." 
              />
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/articles" className={`btn btn-secondary ${styles.btnPadding}`}>Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
