import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  MoreHorizontal,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import LikeButton from '@/components/LikeButton';
import { useAuth } from '@/contexts/AuthContext';
import { commentsService, type Comment } from '@/services/commentsService';
import { getUserDisplayName, getUserInitials } from '../utils/userUtils';
import { useToast } from '@/components/ui/use-toast';
import { shareStory } from '@/utils/shareUtils';



interface InstagramViewerProps {
  story: any;
  initialImageIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const InstagramViewer = ({ story, initialImageIndex = 0, isOpen, onClose }: InstagramViewerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Map<string, { count: number; userLiked: boolean }>>(new Map());
  const { user } = useAuth();
  const { toast } = useToast();

  const images = story?.images || [story?.image];

  useEffect(() => {
    setCurrentImageIndex(initialImageIndex);
  }, [initialImageIndex]);

  useEffect(() => {
    if (story) {
      loadComments();
    }
  }, [story]);

  const loadComments = async () => {
    if (!story) return;
    
    setLoadingComments(true);
    try {
      const storyComments = await commentsService.getComments(story.id.toString(), 'story');
      setComments(storyComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  if (!isOpen || !story) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !story) return;

    try {
      const result = await commentsService.addComment(
        user.email || '',
        getUserDisplayName(user),
        story.id.toString(),
        'story',
        newComment
      );

      if (result.success && result.comment) {
        setComments(prev => [...prev, result.comment!]);
        setNewComment('');
        toast({
          title: "Comment added!",
          description: "Your comment has been posted.",
          duration: 2000,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const handleShareStory = async () => {
    await shareStory(
      story.id,
      story.title,
      (url) => {
        toast({
          title: "Link copied!",
          description: "Story link has been copied to your clipboard.",
          duration: 3000,
        });
      },
      (error) => {
        toast({
          title: "Error",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const result = await commentsService.deleteComment(commentId, user.email || '');
      
      if (result.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        toast({
          title: "Comment deleted",
          description: "Your comment has been removed.",
          duration: 2000,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleCommentLike = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await commentsService.toggleCommentLike(commentId, user.email || '');
      
      if (result.success) {
        setCommentLikes(prev => {
          const newMap = new Map(prev);
          newMap.set(commentId, { count: result.count, userLiked: result.liked });
          return newMap;
        });
        
        // Update the comment in the comments array
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes_count: result.count }
              : comment
          )
        );

        toast({
          title: result.message,
          duration: 1500,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-6xl flex flex-col md:flex-row bg-black">
        {/* Image Section */}
        <div className="flex-1 relative flex items-center justify-center min-h-[60vh] md:min-h-0">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:bg-white/20 z-10 bg-black/30 rounded-full"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </Button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 md:left-4 text-white hover:bg-white/20 z-10 bg-black/30 rounded-full"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 md:right-4 text-white hover:bg-white/20 z-10 bg-black/30 rounded-full"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </Button>
            </>
          )}

          {/* Main Image */}
          <img
            src={images[currentImageIndex]}
            alt={`${story.title} ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 px-3 py-1 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Instagram Style */}
        <div className="w-full md:w-80 bg-white flex flex-col max-h-[40vh] md:max-h-none overflow-y-auto md:overflow-visible">
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {story.title.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">{story.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{story.location}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Story Details */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="truncate">{story.date}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                {story.attendees}
              </div>
            </div>
            
            <Badge className="mb-3">
              {story.category}
            </Badge>
            
            <p className="text-sm text-gray-800 leading-relaxed">
              {story.description}
            </p>
            
            {story.tags && (
              <div className="flex flex-wrap gap-1 mt-3">
                {story.tags.map((tag: string) => (
                  <span key={tag} className="text-blue-600 text-sm">
                    #{tag.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LikeButton
                  itemId={story.id.toString()}
                  itemType="story"
                  initialCount={0}
                  size="md"
                  variant="ghost"
                  showCount={false}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShareStory}>
                  <Share className="w-5 h-5" />
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="mt-2">
              <p className="text-sm font-semibold">
                <LikeButton
                  itemId={story.id.toString()}
                  itemType="story"
                  initialCount={0}
                  size="sm"
                  variant="ghost"
                  showCount={false}
                  className="p-0 h-auto"
                />
                <span className="ml-2">likes</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {images.length > 1 ? `${currentImageIndex + 1} of ${images.length}` : '1 photo'}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {loadingComments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No comments yet</p>
                  <p className="text-xs text-gray-400">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const timeAgo = getTimeAgo(comment.created_at);
                  const isOwnComment = user?.email === comment.user_email;
                  const commentLikeData = commentLikes.get(comment.id);
                  const likeCount = commentLikeData?.count ?? comment.likes_count ?? 0;
                  const userLiked = commentLikeData?.userLiked ?? false;
                  
                  return (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {comment.user_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">{comment.user_name}</span>
                          <span className="text-xs text-gray-500">{timeAgo}</span>
                          {isOwnComment && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-500 hover:text-red-700 ml-2"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{comment.text}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="text-xs text-gray-500 hover:text-gray-700">
                            Reply
                          </button>
                          <button 
                            onClick={() => handleToggleCommentLike(comment.id)}
                            className={`text-xs hover:text-gray-700 ${
                              userLiked ? 'text-red-500 font-semibold' : 'text-gray-500'
                            }`}
                          >
                            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                          </button>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1"
                        onClick={() => handleToggleCommentLike(comment.id)}
                      >
                        <Heart 
                          className={`w-3 h-3 ${
                            userLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add Comment */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {getUserInitials(user)}
                  </span>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-none bg-transparent p-0 focus:ring-0 text-sm"
                  />
                </div>
                {newComment.trim() && (
                  <Button
                    onClick={handleAddComment}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Post
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramViewer;