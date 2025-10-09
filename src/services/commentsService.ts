import { supabase, hasValidSupabaseConfig } from '@/lib/supabase';

export interface Comment {
  id: string;
  user_email: string;
  user_name: string;
  item_id: string;
  item_type: 'project' | 'story';
  text: string;
  created_at: string;
  likes_count?: number;
}

class CommentsService {
  private mockComments: Map<string, Comment[]> = new Map();

  // Get comments for an item
  async getComments(itemId: string, itemType: 'project' | 'story'): Promise<Comment[]> {
    if (!hasValidSupabaseConfig) {
      return this.getMockComments(itemId, itemType);
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return this.getMockComments(itemId, itemType);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getComments:', error);
      return this.getMockComments(itemId, itemType);
    }
  }

  // Add a comment
  async addComment(
    userEmail: string,
    userName: string,
    itemId: string,
    itemType: 'project' | 'story',
    text: string
  ): Promise<{ success: boolean; comment?: Comment; message: string }> {
    if (!hasValidSupabaseConfig) {
      return this.addMockComment(userEmail, userName, itemId, itemType, text);
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_email: userEmail,
          user_name: userName,
          item_id: itemId,
          item_type: itemType,
          text: text
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return this.addMockComment(userEmail, userName, itemId, itemType, text);
      }

      return {
        success: true,
        comment: data,
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('Error in addComment:', error);
      return this.addMockComment(userEmail, userName, itemId, itemType, text);
    }
  }

  // Delete a comment
  async deleteComment(commentId: string, userEmail: string): Promise<{ success: boolean; message: string }> {
    if (!hasValidSupabaseConfig) {
      return this.deleteMockComment(commentId, userEmail);
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_email', userEmail);

      if (error) {
        console.error('Error deleting comment:', error);
        return { success: false, message: 'Failed to delete comment' };
      }

      return { success: true, message: 'Comment deleted successfully' };
    } catch (error) {
      console.error('Error in deleteComment:', error);
      return { success: false, message: 'Failed to delete comment' };
    }
  }

  // Toggle like on a comment
  async toggleCommentLike(
    commentId: string,
    userEmail: string
  ): Promise<{ success: boolean; liked: boolean; count: number; message: string }> {
    if (!hasValidSupabaseConfig) {
      return this.toggleMockCommentLike(commentId, userEmail);
    }

    try {
      // Check if user already liked this comment
      const { data: existingLike, error: checkError } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_email', userEmail)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking comment like:', checkError);
        return this.toggleMockCommentLike(commentId, userEmail);
      }

      let liked = false;

      if (existingLike) {
        // Unlike - remove the like
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Error removing comment like:', deleteError);
          return { success: false, liked: false, count: 0, message: 'Failed to unlike comment' };
        }

        liked = false;
      } else {
        // Like - add the like
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_email: userEmail
          });

        if (insertError) {
          console.error('Error adding comment like:', insertError);
          return { success: false, liked: false, count: 0, message: 'Failed to like comment' };
        }

        liked = true;
      }

      // Get updated count
      const { count, error: countError } = await supabase
        .from('comment_likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      const likeCount = countError ? 0 : (count || 0);

      return {
        success: true,
        liked,
        count: likeCount,
        message: liked ? 'Comment liked!' : 'Comment unliked!'
      };
    } catch (error) {
      console.error('Error in toggleCommentLike:', error);
      return this.toggleMockCommentLike(commentId, userEmail);
    }
  }

  // Mock implementation - returns empty comments array
  private getMockComments(itemId: string, itemType: 'project' | 'story'): Comment[] {
    const key = `${itemType}-${itemId}`;

    // Initialize empty comments array if not exists
    if (!this.mockComments.has(key)) {
      this.mockComments.set(key, []);
    }

    return this.mockComments.get(key) || [];
  }

  private addMockComment(
    userEmail: string,
    userName: string,
    itemId: string,
    itemType: 'project' | 'story',
    text: string
  ): { success: boolean; comment: Comment; message: string } {
    const key = `${itemType}-${itemId}`;
    const comments = this.mockComments.get(key) || [];

    const newComment: Comment = {
      id: Date.now().toString(),
      user_email: userEmail,
      user_name: userName,
      item_id: itemId,
      item_type: itemType,
      text: text,
      created_at: new Date().toISOString(),
      likes_count: 0
    };

    comments.push(newComment);
    this.mockComments.set(key, comments);

    console.log('🔄 Mock comment added:', {
      itemType,
      itemId,
      userName,
      text: text.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      comment: newComment,
      message: 'Comment added successfully (Mock mode)'
    };
  }

  private deleteMockComment(commentId: string, userEmail: string): { success: boolean; message: string } {
    // Find and remove comment from all mock data
    for (const [key, comments] of this.mockComments.entries()) {
      const commentIndex = comments.findIndex(c => c.id === commentId && c.user_email === userEmail);
      if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
        this.mockComments.set(key, comments);

        console.log('🔄 Mock comment deleted:', {
          commentId,
          userEmail,
          timestamp: new Date().toISOString()
        });

        return { success: true, message: 'Comment deleted successfully (Mock mode)' };
      }
    }

    return { success: false, message: 'Comment not found or unauthorized' };
  }

  private toggleMockCommentLike(
    commentId: string,
    userEmail: string
  ): { success: boolean; liked: boolean; count: number; message: string } {
    // Find the comment and toggle its like count
    for (const [key, comments] of this.mockComments.entries()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        // Simple mock: just increment/decrement likes
        const currentLikes = comment.likes_count || 0;
        const wasLiked = currentLikes > 0 && Math.random() > 0.5; // Mock previous like state

        if (wasLiked) {
          comment.likes_count = Math.max(0, currentLikes - 1);
        } else {
          comment.likes_count = currentLikes + 1;
        }

        const liked = !wasLiked;

        console.log('🔄 Mock comment like toggled:', {
          commentId,
          userEmail,
          liked,
          count: comment.likes_count,
          timestamp: new Date().toISOString()
        });

        return {
          success: true,
          liked,
          count: comment.likes_count,
          message: liked ? 'Comment liked!' : 'Comment unliked!'
        };
      }
    }

    return { success: false, liked: false, count: 0, message: 'Comment not found' };
  }
}

export const commentsService = new CommentsService();