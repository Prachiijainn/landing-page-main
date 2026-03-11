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
  orderBy,
  getDoc,
  serverTimestamp,
  increment,
  writeBatch
} from "firebase/firestore";

export interface Comment {
  id: string;
  user_email: string;
  user_name: string;
  item_id: string;
  item_type: 'project' | 'story';
  text: string;
  created_at: any;
  likes_count?: number;
}

class CommentsService {
  private get collection() {
    return collection(db, 'comments');
  }

  private get likesCollection() {
    return collection(db, 'comment_likes');
  }

  // Get comments for an item
  async getComments(itemId: string, itemType: 'project' | 'story'): Promise<Comment[]> {
    try {
      const q = query(
        this.collection,
        where('item_id', '==', itemId),
        where('item_type', '==', itemType),
        orderBy('created_at', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
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
    try {
      const commentData = {
        user_email: userEmail,
        user_name: userName,
        item_id: itemId,
        item_type: itemType,
        text: text,
        created_at: serverTimestamp(),
        likes_count: 0
      };

      const docRef = await addDoc(this.collection, commentData);

      return {
        success: true,
        comment: { id: docRef.id, ...commentData } as Comment,
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('Error in addComment:', error);
      return {
        success: false,
        message: 'Failed to add comment'
      };
    }
  }

  // Delete a comment
  async deleteComment(commentId: string, userEmail: string): Promise<{ success: boolean; message: string }> {
    try {
      const commentRef = doc(db, 'comments', commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists() || commentSnap.data().user_email !== userEmail) {
        return { success: false, message: 'Comment not found or unauthorized' };
      }

      await deleteDoc(commentRef);
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
    try {
      const likeId = `${commentId}_${userEmail.replace(/[@.]/g, '_')}`;
      const likeRef = doc(db, 'comment_likes', likeId);
      const likeSnap = await getDoc(likeRef);
      const commentRef = doc(db, 'comments', commentId);

      const batch = writeBatch(db);
      let liked = false;
      let countChange = 0;

      if (likeSnap.exists()) {
        batch.delete(likeRef);
        batch.update(commentRef, { likes_count: increment(-1) });
        liked = false;
        countChange = -1;
      } else {
        batch.set(likeRef, {
          comment_id: commentId,
          user_email: userEmail,
          created_at: serverTimestamp()
        });
        batch.update(commentRef, { likes_count: increment(1) });
        liked = true;
        countChange = 1;
      }

      await batch.commit();

      // Get updated count
      const updatedSnap = await getDoc(commentRef);
      const newCount = updatedSnap.data()?.likes_count || 0;

      return {
        success: true,
        liked,
        count: newCount,
        message: liked ? 'Comment liked!' : 'Comment unliked!'
      };
    } catch (error) {
      console.error('Error in toggleCommentLike:', error);
      return { success: false, liked: false, count: 0, message: 'An error occurred' };
    }
  }
}

export const commentsService = new CommentsService();
