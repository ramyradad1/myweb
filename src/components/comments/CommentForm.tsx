'use client';

import { useState } from 'react';
import styles from './comments.module.css';

interface Props {
  onSubmit: (name: string, content: string) => Promise<boolean>;
  placeholder?: string;
  isReply?: boolean;
  onCancel?: () => void;
}

export default function CommentForm({ onSubmit, placeholder = 'Add a comment...', isReply = false, onCancel }: Props) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(name, content);
    
    if (success) {
      setContent('');
      if (!isReply) setName(''); // Keep name for top-level if they want to post again easily
    } else {
      setError('Failed to post comment. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${isReply ? styles.replyForm : ''}`}>
      {error && <p className={styles.errorText}>{error}</p>}
      
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
        required
        maxLength={50}
        disabled={isSubmitting}
      />
      
      <textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        required
        maxLength={1000}
        rows={isReply ? 2 : 4}
        disabled={isSubmitting}
      />
      
      <div className={styles.formActions}>
        {isReply && onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className={styles.cancelBtn}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={isSubmitting || !name.trim() || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
