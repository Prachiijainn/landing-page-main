import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  increment,
  writeBatch
} from "firebase/firestore";

export interface Like {
  id: string;
  user_email: string;
  item_id: string;
  item_type: 'project' | 'story';
  created_at: any;
}

class LikesService {
  private get collection() {
    return collection(db, 'likes');
  }

  // Toggle like for an item (project or story)
  async toggleLike(
    userEmail: string,
    itemId: string,
    itemType: 'project' | 'story'
  ): Promise<{ success: boolean; liked: boolean; count: number; message: string }> {
    try {
      const likeId = `${itemId}_${userEmail.replace(/[@.]/g, '_')}`;
      const likeRef = doc(db, 'likes', likeId);
      const likeSnap = await getDoc(likeRef);

      const batch = writeBatch(db);
      let liked = false;

      if (likeSnap.exists()) {
        // Unlike
        batch.delete(likeRef);
        liked = false;

        // Update project likes_count if it's a project
        if (itemType === 'project') {
          const projectRef = doc(db, 'projects', itemId);
          batch.update(projectRef, { likes_count: increment(-1) });
        }
      } else {
        // Like
        batch.set(likeRef, {
          user_email: userEmail,
          item_id: itemId,
          item_type: itemType,
          created_at: serverTimestamp()
        });
        liked = true;

        // Update project likes_count if it's a project
        if (itemType === 'project') {
          const projectRef = doc(db, 'projects', itemId);
          batch.update(projectRef, { likes_count: increment(1) });
        }
      }

      await batch.commit();

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
      return { success: false, liked: false, count: 0, message: 'An error occurred' };
    }
  }

  // Get likes count for an item
  async getLikesCount(itemId: string, itemType: 'project' | 'story'): Promise<number> {
    try {
      if (itemType === 'project') {
        const projectRef = doc(db, 'projects', itemId);
        const projectSnap = await getDoc(projectRef);
        return projectSnap.exists() ? (projectSnap.data()?.likes_count || 0) : 0;
      }

      const q = query(
        this.collection,
        where('item_id', '==', itemId),
        where('item_type', '==', itemType)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error in getLikesCount:', error);
      return 0;
    }
  }

  // Check if user has liked an item
  async hasUserLiked(
    userEmail: string,
    itemId: string,
    itemType: 'project' | 'story'
  ): Promise<boolean> {
    try {
      const likeId = `${itemId}_${userEmail.replace(/[@.]/g, '_')}`;
      const likeSnap = await getDoc(doc(db, 'likes', likeId));
      return likeSnap.exists();
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

    try {
      // For each item, get its status
      await Promise.all(items.map(async (item) => {
        const count = await this.getLikesCount(item.id, item.type);
        const userLiked = await this.hasUserLiked(userEmail, item.id, item.type);
        result.set(item.id, { count, userLiked });
      }));

      return result;
    } catch (error) {
      console.error('Error in getLikesForItems:', error);
      return result;
    }
  }
}

export const likesService = new LikesService();
