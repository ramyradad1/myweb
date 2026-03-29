'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentItem, { CommentType } from './CommentItem';
import { getComments, addComment } from '@/app/actions/comments';
import styles from './comments.module.css';

interface Props {
  articleId: string;
}

export default function CommentSection({ articleId }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    setIsLoading(true);
    const res = await getComments(articleId);
    if (res.success) {
      // Build a tree from the flat list
      const allComments = res.comments;
      const commentMap = new Map<string, CommentType>();
      const roots: CommentType[] = [];

      allComments.forEach((c: CommentType) => {
        commentMap.set(c.id, { ...c, replies: [] });
      });

      allComments.forEach((c: CommentType) => {
        const comment = commentMap.get(c.id)!;
        if (c.parent_id) {
          const parent = commentMap.get(c.parent_id);
          if (parent) {
            parent.replies!.push(comment);
          } else {
            // Parent missing, just put at root
            roots.push(comment);
          }
        } else {
          roots.push(comment);
        }
      });

      setComments(roots);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const handleTopLevelSubmit = async (name: string, content: string) => {
    const res = await addComment({ article_id: articleId, author_name: name, content });
    if (res.success) {
      await fetchComments();
      return true;
    }
    return false;
  };

  const handleReplySubmit = async (parentId: string, name: string, content: string) => {
    const res = await addComment({ article_id: articleId, parent_id: parentId, author_name: name, content });
    if (res.success) {
      await fetchComments();
      return true;
    }
    return false;
  };

  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionTitle}>Discussion</h3>
      
      <div className={styles.topFormContainer}>
        <CommentForm onSubmit={handleTopLevelSubmit} placeholder="Join the discussion..." />
      </div>

      <div className={styles.commentsList}>
        {isLoading ? (
          <p className={styles.loadingText}>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onReplySubmit={handleReplySubmit} 
            />
          ))
        ) : (
          <p className={styles.emptyText}>No comments yet. Be the first to start the conversation!</p>
        )}
      </div>
    </div>
  );
}
