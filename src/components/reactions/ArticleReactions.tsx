'use client';

import { useState, useEffect } from 'react';
import { reactToArticle } from '@/app/actions/comments';
import styles from './reactions.module.css';

interface Props {
  articleId: string;
  initialCounts: {
    like: number;
    love: number;
    mindblown: number;
  };
}

type ReactionType = 'like' | 'love' | 'mindblown';

export default function ArticleReactions({ articleId, initialCounts }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [reactedType, setReactedType] = useState<ReactionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check local storage to see if user already reacted
    const stored = localStorage.getItem(`article_reaction_${articleId}`);
    if (stored && ['like', 'love', 'mindblown'].includes(stored)) {
      setReactedType(stored as ReactionType);
    }
  }, [articleId]);

  const handleReact = async (type: ReactionType) => {
    if (reactedType || isSubmitting) return; // Prevent multiple reactions
    
    setIsSubmitting(true);
    
    // Optimistic update
    setReactedType(type);
    setCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));

    try {
      const res = await reactToArticle(articleId, type);
      if (res.success) {
        localStorage.setItem(`article_reaction_${articleId}`, type);
      } else {
        // Revert on failure
        setReactedType(null);
        setCounts(prev => ({
          ...prev,
          [type]: prev[type] - 1
        }));
      }
    } catch {
      // Revert on failure
      setReactedType(null);
      setCounts(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.reactionContainer}>
      <h3 className={styles.reactionTitle}>What do you think about this article?</h3>
      <div className={styles.reactionButtons}>
        <button 
          onClick={() => handleReact('like')} 
          className={`${styles.reactBtn} ${reactedType === 'like' ? styles.activeReact : ''} ${reactedType && reactedType !== 'like' ? styles.dimmed : ''}`}
          disabled={!!reactedType || isSubmitting}
        >
          <span className={styles.emoji}>👍</span>
          <span className={styles.count}>{counts.like}</span>
        </button>
        
        <button 
          onClick={() => handleReact('love')} 
          className={`${styles.reactBtn} ${reactedType === 'love' ? styles.activeReact : ''} ${reactedType && reactedType !== 'love' ? styles.dimmed : ''}`}
          disabled={!!reactedType || isSubmitting}
        >
          <span className={styles.emoji}>❤️</span>
          <span className={styles.count}>{counts.love}</span>
        </button>
        
        <button 
          onClick={() => handleReact('mindblown')} 
          className={`${styles.reactBtn} ${reactedType === 'mindblown' ? styles.activeReact : ''} ${reactedType && reactedType !== 'mindblown' ? styles.dimmed : ''}`}
          disabled={!!reactedType || isSubmitting}
        >
          <span className={styles.emoji}>🤯</span>
          <span className={styles.count}>{counts.mindblown}</span>
        </button>
      </div>
    </div>
  );
}
