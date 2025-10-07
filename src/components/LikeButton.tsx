import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { likesService } from '@/services/likesService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LikeButtonProps {
  itemId: string;
  itemType: 'project' | 'story';
  initialCount?: number;
  initialLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showCount?: boolean;
  className?: string;
}

const LikeButton = ({
  itemId,
  itemType,
  initialCount = 0,
  initialLiked = false,
  size = 'sm',
  variant = 'ghost',
  showCount = true,
  className = ''
}: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      loadLikeStatus();
    }
  }, [user?.email, itemId]);

  const loadLikeStatus = async () => {
    if (!user?.email) return;

    try {
      const [userLiked, likesCount] = await Promise.all([
        likesService.hasUserLiked(user.email, itemId, itemType),
        likesService.getLikesCount(itemId, itemType)
      ]);

      setLiked(userLiked);
      setCount(likesCount);
    } catch (error) {
      console.error('Error loading like status:', error);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!user?.email) {
      toast({
        title: "Login Required",
        description: "Please log in to like items",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await likesService.toggleLike(user.email, itemId, itemType);
      
      if (result.success) {
        setLiked(result.liked);
        setCount(result.count);
        
        toast({
          title: result.message,
          description: result.liked 
            ? `You liked this ${itemType}!` 
            : `You unliked this ${itemType}`,
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
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-2';
      case 'lg':
        return 'h-12 px-4';
      default:
        return 'h-10 px-3';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={`${getSizeClasses()} ${className} transition-all duration-200 ${
        liked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 hover:text-red-500'
      }`}
    >
      <Heart 
        className={`${getIconSize()} ${
          liked ? 'fill-current' : ''
        } transition-all duration-200`} 
      />
      {showCount && (
        <span className="ml-1 text-sm font-medium">
          {count}
        </span>
      )}
    </Button>
  );
};

export default LikeButton;