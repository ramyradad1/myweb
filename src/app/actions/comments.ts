'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Using the admin client for inserts to guarantee it goes through despite any RLS edge cases,
// since we want anon users to freely post comments.
// For reads, we use the regular client.

export async function addComment(data: {
  article_id: string;
  parent_id?: string | null;
  author_name: string;
  content: string;
}) {
  try {
    const { error } = await supabaseAdmin.from('comments').insert({
      article_id: data.article_id,
      parent_id: data.parent_id || null,
      author_name: data.author_name.trim(),
      content: data.content.trim(),
    });

    if (error) throw error;
    
    // Attempt revalidation so the page updates immediately for future visitors
    revalidatePath(`/articles/[slug]`, 'page');
    
    return { success: true };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: 'Failed to post comment' };
  }
}

export async function getComments(article_id: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', article_id)
      .order('created_at', { ascending: true }); // Oldest first for threads

    if (error) throw error;
    return { success: true, comments: data || [] };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, comments: [] };
  }
}

export async function reactToComment(comment_id: string) {
  try {
    const { error } = await supabase.rpc('increment_comment_like', { p_comment_id: comment_id });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error reacting to comment:', error);
    return { success: false };
  }
}

export async function reactToArticle(article_id: string, type: 'like' | 'love' | 'mindblown') {
  try {
    const { error } = await supabase.rpc('increment_article_reaction', { 
      p_article_id: article_id,
      p_reaction_type: type
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error reacting to article:', error);
    return { success: false };
  }
}
