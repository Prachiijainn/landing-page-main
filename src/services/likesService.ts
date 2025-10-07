import { supabase, hasValidSupabaseConfig } from '@/lib/supabase';

export interface Like {
  id: string;
  user_email: string;
  item_id: string;
  item_type: 'project' | 'story';
  created_at: string;
}

class LikesService {
  private mockLikes: Map<string, Set<string>> = new Map(); // itemId -> Set of user emails

  // Toggle like for an item (project or story)
  async toggleLike(
    userEmail: string,
    itemId: string,
    itemType: 'project' | 'story'
  ): Promise<{ success: boolean; liked: boolean; count: number; message: string }> {
    if (!hasValidSupabaseConfig) {
      return this.toggleLikeMock(userEmail, itemId, itemType);
    }

    try {
      // Check if user already liked this item
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_email', userEmail)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing like:', checkError);
        return this.toggleLikeMock(userEmail, itemId, itemType);
      }

      let liked = false;
      
      if (existingLike) {
        // Unlike - remove the like
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Error removing like:', deleteError);
          return { success: false, liked: false, count: 0, message: 'Failed to unlike' };
        }
        
        liked = false;
      } else {
        // Like - add the like
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            user_email: userEmail,
            item_id: itemId,
            item_type: itemType
          });

        if (insertError) {
          console.error('Error adding like:', insertError);
          return { success: false, liked: false, count: 0, message: 'Failed to like' };
        }
        
        liked = true;
      }

      // Get updated count
      const count = await this.getLikesCount(itemId, itemType);
      
      return {
        success: true,
        liked,
        count,
        message: liked ? 'Liked!' : 'Unliked!'
      };
    } catch (error) {
      console.error('Error in toggleLike:', error);
      return this.toggleLikeMock(userEmail, itemId, itemType);
    }
  }

  // Get likes count for an item
  async getLikesCount(itemId: string, itemType: 'project' | 'story'): Promise<number> {
    if (!hasValidSupabaseConfig) {
      return this.mockLikes.get(itemId)?.size || 0;
    }

    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', itemId)
        .eq('item_type', itemType);

      if (error) {
        console.error('Error getting likes count:', error);
        return this.mockLikes.get(itemId)?.size || 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getLikesCount:', error);
      return this.mockLikes.get(itemId)?.size || 0;
    }
  }

  // Check if user has liked an item
  async hasUserLiked(
    userEmail: string,
    itemId: string,
    itemType: 'project' | 'story'
  ): Promise<boolean> {
    if (!hasValidSupabaseConfig) {
      return this.mockLikes.get(itemId)?.has(userEmail) || false;
    }

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_email', userEmail)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user like:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in hasUserLiked:', error);
      return false;
    }
  }

  // Get likes for multiple items (for bulk loading)
  async getLikesForItems(
    userEmail: string,
    items: Array<{ id: string; type: 'project' | 'story' }>
  ): Promise<Map<string, { count: number; userLiked: boolean }>> {
    const result = new Map<string, { count: number; userLiked: boolean }>();

    if (!hasValidSupabaseConfig) {
      // Mock data
      items.forEach(item => {
        const count = this.mockLikes.get(item.id)?.size || Math.floor(Math.random() * 50);
        const userLiked = this.mockLikes.get(item.id)?.has(userEmail) || false;
        result.set(item.id, { count, userLiked });
      });
      return result;
    }

    try {
      // Get all likes for these items
      const itemIds = items.map(item => item.id);
      const { data: likes, error } = await supabase
        .from('likes')
        .select('item_id, user_email')
        .in('item_id', itemIds);

      if (error) {
        console.error('Error getting bulk likes:', error);
        return result;
      }

      // Process the data
      items.forEach(item => {
        const itemLikes = likes?.filter(like => like.item_id === item.id) || [];
        const count = itemLikes.length;
        const userLiked = itemLikes.some(like => like.user_email === userEmail);
        result.set(item.id, { count, userLiked });
      });

      return result;
    } catch (error) {
      console.error('Error in getLikesForItems:', error);
      return result;
    }
  }

  // Mock implementation for development
  private toggleLikeMock(
    userEmail: string,
    itemId: string,
    itemType: 'project' | 'story'
  ): { success: boolean; liked: boolean; count: number; message: string } {
    if (!this.mockLikes.has(itemId)) {
      this.mockLikes.set(itemId, new Set());
    }

    const itemLikes = this.mockLikes.get(itemId)!;
    const wasLiked = itemLikes.has(userEmail);

    if (wasLiked) {
      itemLikes.delete(userEmail);
    } else {
      itemLikes.add(userEmail);
    }

    const liked = !wasLiked;
    const count = itemLikes.size;

    console.log(`🔄 Mock ${itemType} ${liked ? 'liked' : 'unliked'}:`, {
      itemId,
      userEmail,
      count,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      liked,
      count,
      message: liked ? 'Liked!' : 'Unliked!'
    };
  }
}

export const likesService = new LikesService();