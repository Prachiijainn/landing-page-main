import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, X, Share2 } from 'lucide-react';
import LikeButton from '@/components/LikeButton';
import { useToast } from '@/components/ui/use-toast';
import { shareStory } from '@/utils/shareUtils';

interface StoryDetailModalProps {
  story: any;
  isOpen: boolean;
  onClose: () => void;
  storyLikes: Map<string, number>;
}

const StoryDetailModal = ({ story, isOpen, onClose, storyLikes }: StoryDetailModalProps) => {
  const { toast } = useToast();

  if (!isOpen || !story) return null;

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

  const getCategoryColor = (category: string) => {
    const colors = {
      "Meetup": "bg-blue-100 text-blue-800",
      "Community Service": "bg-green-100 text-green-800",
      "Education": "bg-purple-100 text-purple-800",
      "Fundraising": "bg-pink-100 text-pink-800",
      "Competition": "bg-orange-100 text-orange-800",
      "Family Event": "bg-yellow-100 text-yellow-800",
      "Panel Discussion": "bg-indigo-100 text-indigo-800",
      "Environmental": "bg-emerald-100 text-emerald-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={story.image} 
            alt={story.title}
            className="w-full h-48 md:h-80 object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
          <Badge className={`absolute top-4 left-4 ${getCategoryColor(story.category)} border-0`}>
            {story.category}
          </Badge>
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{story.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {story.date}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{story.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {story.attendees} attendees
            </div>
          </div>
          
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
            {story.description}
          </p>
          
          {story.highlights && story.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Event Highlights</h3>
              <ul className="space-y-2">
                {story.highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-sm md:text-base">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {story.tags && story.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs md:text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Images Gallery */}
          {story.images && story.images.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                Event Photos ({story.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {story.images.map((image: string, index: number) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={image}
                      alt={`${story.title} ${index + 1}`}
                      className="w-full h-24 md:h-32 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <LikeButton 
              itemId={story.id.toString()} 
              itemType="story"
              initialCount={storyLikes.get(story.id.toString()) || 0}
              size="md"
              variant="outline"
              className="flex items-center justify-center"
            />
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={handleShareStory}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailModal;