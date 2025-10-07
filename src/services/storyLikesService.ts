import { likesService } from './likesService';

class StoryLikesService {
  private storyLikesCache: Map<string, number> = new Map();

  // Get real-time likes count for a story
  async getStoryLikes(storyId: string): Promise<number> {
    try {
      const count = await likesService.getLikesCount(storyId, 'story');
      this.storyLikesCache.set(storyId, count);
      return count;
    } catch (error) {
      console.error('Error getting story likes:', error);
      return this.storyLikesCache.get(storyId) || 0;
    }
  }

  // Get likes for multiple stories
  async getMultipleStoryLikes(storyIds: string[]): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    
    try {
      // Get likes for all stories in parallel
      const promises = storyIds.map(async (storyId) => {
        const count = await this.getStoryLikes(storyId);
        return { storyId, count };
      });
      
      const results = await Promise.all(promises);
      
      results.forEach(({ storyId, count }) => {
        result.set(storyId, count);
      });
      
      return result;
    } catch (error) {
      console.error('Error getting multiple story likes:', error);
      return result;
    }
  }

  // Update cached likes count
  updateCachedLikes(storyId: string, count: number) {
    this.storyLikesCache.set(storyId, count);
  }
}

export const storyLikesService = new StoryLikesService();