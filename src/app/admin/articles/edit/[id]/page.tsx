'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../../lib/supabase';
import styles from '../../../admin.module.css';

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    imageUrl: '',
    content: '',
    metaDescription: '',
    author: 'Editorial Team',
    status: 'published'
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();
          
        if (error) throw error;
        if (data) {
          setFormData({
            title: data.title || '',
            category: data.category || 'Technology',
            imageUrl: data.heroImage || '',
            content: data.content || '',
            metaDescription: data.metaDescription || '',
            author: data.author || 'Editorial Team',
            status: data.status || 'published'
          });
        }
      } catch (err) {
        console.error("Error loading article:", err);
        alert("Failed to load article data.");
        router.push('/admin/articles');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (articleId) fetchArticle();
  }, [articleId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('articles').update({
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        metaDescription: formData.metaDescription || formData.title,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        heroImage: formData.imageUrl,
        status: formData.status
      }).eq('id', articleId);
      
      if (error) throw error;
      router.push('/admin/articles');
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Failed to update article.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.adminContainer}>
        <div className={`${styles.mainContent} ${styles.centerLoading}`}>
          Loading article data...
        </div>
      </div>
    );
  }

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
            <h1 className={styles.headerTitle}>Edit Article</h1>
            <p className={styles.headerSubtitle}>Modify existing content.</p>
          </div>
        </header>

        <div className={`glass-panel ${styles.formPanel}`}>
          <form onSubmit={handleSubmit} className={styles.formLayout}>
            <div>
              <label htmlFor="articleTitle" className={`${styles.inputLabel} ${styles.inputGroup}`}>Title</label>
              <input 
                id="articleTitle"
                title="Article Title"
                placeholder="Enter Title"
                type="text" 
                className={styles.inputField} 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className={styles.gridTwoCols}>
              <div>
                <label htmlFor="articleCategory" className={`${styles.inputLabel} ${styles.inputGroup}`}>Category</label>
                <select 
                  id="articleCategory"
                  title="Article Category"
                  className={styles.inputField} 
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Science">Science</option>
                  <option value="Culture">Culture</option>
                  <option value="Design">Design</option>
                  <option value="AI">AI</option>
                </select>
              </div>
              <div>
                <label htmlFor="articleStatus" className={`${styles.inputLabel} ${styles.inputGroup}`}>Status</label>
                <select 
                  id="articleStatus"
                  title="Article Status"
                  className={styles.inputField} 
                  required
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className={styles.gridTwoCols}>
              <div>
                <label htmlFor="articleAuthor" className={`${styles.inputLabel} ${styles.inputGroup}`}>Author Name</label>
                <input 
                  id="articleAuthor"
                  title="Author Name"
                  placeholder="Author"
                  type="text" 
                  className={styles.inputField} 
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="articleImage" className={`${styles.inputLabel} ${styles.inputGroup}`}>Hero Image URL</label>
                <input 
                  id="articleImage"
                  title="Hero Image URL"
                  placeholder="https://..."
                  type="url" 
                  className={styles.inputField} 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="articleMeta" className={`${styles.inputLabel} ${styles.inputGroup}`}>Meta Description (SEO)</label>
              <input 
                id="articleMeta"
                title="Meta Description"
                placeholder="Brief SEO snippet..."
                type="text" 
                className={styles.inputField} 
                value={formData.metaDescription}
                onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                maxLength={155}
              />
            </div>

            <div>
              <label htmlFor="articleContent" className={`${styles.inputLabel} ${styles.inputGroup}`}>Content (HTML / Markdown)</label>
              <textarea 
                id="articleContent"
                title="Content Block"
                placeholder="Main article content..."
                className={`${styles.inputField} ${styles.textareaField}`}
                required 
                rows={12}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/articles" className={`btn btn-secondary ${styles.btnPadding}`}>Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
