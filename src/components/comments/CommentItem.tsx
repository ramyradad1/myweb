'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';
import { reactToComment } from '@/app/actions/comments';
import styles from './comments.module.css';

export interface CommentType {
  id: string;
  parent_id: string | null;
  author_name: string;
  content: string;
  likes: number;
  created_at: string;
  replies?: CommentType[];
}

interface Props {
  comment: CommentType;
  onReplySubmit: (parentId: string, name: string, content: string) => Promise<boolean>;
}

export default function CommentItem({ comment, onReplySubmit }: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    // Check if liked in this session
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`comment_like_${comment.id}`) === 'true';
    }
    return false;
  });

  const handleLike = async () => {
    if (hasLiked) return;
    
    setHasLiked(true);
    setLikes(prev => prev + 1);

    const res = await reactToComment(comment.id);
    if (res.success) {
      localStorage.setItem(`comment_like_${comment.id}`, 'true');
    } else {
      // Revert optimism if failed
      setHasLiked(false);
      setLikes(prev => prev - 1);
    }
  };

  const formattedDate = new Date(comment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentAvatar}>
        {comment.author_name.charAt(0).toUpperCase()}
      </div>
      
      <div className={styles.commentBody}>
        <div className={styles.commentHeader}>
          <span className={styles.authorName}>{comment.author_name}</span>
          <span className={styles.commentDate}>{formattedDate}</span>
        </div>
        
        <p className={styles.commentContent}>{comment.content}</p>
        
        <div className={styles.commentActions}>
          <button 
            onClick={handleLike} 
            className={`${styles.actionBtn} ${hasLiked ? styles.liked : ''}`}
            disabled={hasLiked}
          >
            <span className={styles.icon}>👍</span> {likes}
          </button>
          
          <button 
            onClick={() => setIsReplying(!isReplying)} 
            className={styles.actionBtn}
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <div className={styles.replyBox}>
            <CommentForm 
              isReply={true} 
              onCancel={() => setIsReplying(false)}
              onSubmit={async (name, content) => {
                const success = await onReplySubmit(comment.id, name, content);
                if (success) setIsReplying(false);
                return success;
              }}
            />
          </div>
        )}

        {/* Recursive rendering of replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.repliesContainer}>
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                onReplySubmit={onReplySubmit} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
