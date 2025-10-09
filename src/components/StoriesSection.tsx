import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Share2, X, Grid, List } from "lucide-react";
import LikeButton from "@/components/LikeButton";
import MediaViewer from "@/components/MediaViewer";
import InstagramViewer from "@/components/InstagramViewer";
import StoryDetailModal from "@/components/StoryDetailModal";
import { storyLikesService } from "@/services/storyLikesService";
import { isVideo } from "../utils/mediaUtils";

const StoriesSection = () => {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInstagramViewerOpen, setIsInstagramViewerOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'grid'>('gallery');
  const [storyLikes, setStoryLikes] = useState<Map<string, number>>(new Map());

  const stories = [
    {
      id: 1,
      title: "5 HOUR LIVE HACKATHON",
      category: "Competition",
      date: "October 4, 2025",
      location: "Discord",
      attendees: 15,
      image: "/Hackathon.png",
      images: [
        "/team-aman.jpg",
        "/r&d-dynasty.jpg",
        "/pheonix-rise.jpg",
        "/team-nakul2.jpeg",
        "/codde.jpeg",
        "/video1.jpeg",
        "/l.mp4",
        "/ll.mp4"
      ],
      description: "An incredible evening of networking, learning, and innovation. Our community came together for 5 HOUR LIVE HACKATHON.",
      highlights: ["4 inspiring developers", "15+ networking connections made"],
      tags: ["Technology", "Networking", "Innovation"],
      likes: 50
    },
    {
      id: 2,
      title: "Community Meetup",
      category: "Meetup",
      date: "September 24, 2025",
      location: "Block 9, Chandigarh Group of Colleges",
      attendees: 15,
      image: "/logo192.png",
      images: [
        "/meet.jpg",
        "/meet2.jpg",
        "/meet3.jpg",
        "/meet4.jpg"
      ],
      description: "Had a great CHIT-CHAT between students. Everyone was delighted to have such good experience.",
      highlights: ["students meetup", "knowledge gained", "Community cookbook created"],
      tags: ["planning", "Community", "together"],
      likes: 38
    }
  ];

  const categories = ["All", "Meetup", "Competition"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStories = selectedCategory === "All"
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  // Load story likes on component mount
  useEffect(() => {
    const loadStoryLikes = async () => {
      const storyIds = stories.map(story => story.id.toString());
      const likesMap = await storyLikesService.getMultipleStoryLikes(storyIds);
      setStoryLikes(likesMap);
    };

    loadStoryLikes();
  }, []);

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
    <section id="stories" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Community Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the moments that define our community. From inspiring meetups to impactful service projects,
              these are the stories that bring us together and drive us forward.
            </p>
          </div>

          {/* Category Filter and View Toggle */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-200 ${selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md border">
              <Button
                variant={viewMode === 'gallery' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('gallery')}
                className="flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                Gallery
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Grid
              </Button>
            </div>
          </div>

          {/* Stories Display */}
          {viewMode === 'gallery' ? (
            /* Gallery View - Separate Image Cards */
            <div className="columns-2 md:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6 mb-16">
              {filteredStories.map((story) =>
                (story.images || [story.image]).map((image, imageIndex) => (
                  <div
                    key={`${story.id}-${imageIndex}`}
                    className="break-inside-avoid mb-4 md:mb-6 group cursor-pointer"
                    onClick={() => {
                      setSelectedStory(story);
                      setSelectedImageIndex(imageIndex);
                      setIsInstagramViewerOpen(true);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                      <div className="relative overflow-hidden">
                        <MediaViewer
                          src={image}
                          alt={`${story.title} ${imageIndex + 1}`}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ aspectRatio: Math.random() > 0.5 ? '4/5' : Math.random() > 0.5 ? '3/4' : '1/1' }}
                          controls={isVideo(image)}
                          muted={true}
                          loop={isVideo(image)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Overlay Content */}
                        <div className="absolute inset-0 p-2 md:p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex justify-between items-start">
                            <Badge className={`${getCategoryColor(story.category)} border-0`}>
                              {story.category}
                            </Badge>
                            <div className="flex space-x-2">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                <Eye className="w-4 h-4 text-gray-700" />
                              </div>
                            </div>
                          </div>

                          <div className="text-white">
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 line-clamp-2">
                              {story.title}
                              {(story.images || [story.image]).length > 1 && (
                                <span className="text-xs opacity-75 ml-1">
                                  ({imageIndex + 1}/{(story.images || [story.image]).length})
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center text-xs md:text-sm mb-1 md:mb-2">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {story.date}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs md:text-sm">
                                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {story.attendees}
                              </div>
                              <LikeButton
                                itemId={story.id.toString()}
                                itemType="story"
                                initialCount={storyLikes.get(story.id.toString()) || 0}
                                size="sm"
                                variant="ghost"
                                className="text-white hover:text-red-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Grid View - Traditional Cards */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
              {filteredStories.map((story, index) => (
                <Card
                  key={story.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 cursor-pointer overflow-hidden bg-white"
                  onClick={() => {
                    setSelectedStory(story);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <div className="relative overflow-hidden">
                    <MediaViewer
                      src={story.image}
                      alt={story.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      controls={isVideo(story.image)}
                      muted={true}
                      loop={isVideo(story.image)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge className={`absolute top-4 left-4 ${getCategoryColor(story.category)} border-0`}>
                      {story.category}
                    </Badge>
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Eye className="w-4 h-4 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                      {story.description}
                    </p>

                    <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        <span className="truncate">{story.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        <span className="truncate">{story.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        {story.attendees} attendees
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <LikeButton
                        itemId={story.id.toString()}
                        itemType="story"
                        initialCount={storyLikes.get(story.id.toString()) || 0}
                        size="sm"
                        variant="ghost"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {story.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {story.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{story.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Impact Stats */}
          {/* <div className="bg-gradient-to-r from-blue-400 via-purple-800 to-pink-400 rounded-3xl p-8 md:p-12 text-white mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Community Impact</h3>
              <p className="text-xl opacity-90">Together, we're making a difference</p>
            </div>
          </div> */}

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Be Part of the Next Story
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our vibrant community and help us create more amazing memories together.
              Your story could be the next one featured here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                asChild
              >
                <a
                  href="https://chat.whatsapp.com/FJvnsTIzJxy8iIPPHfIkJ7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Our Community
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <MediaViewer
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-64 md:h-80 object-cover"
                controls={isVideo(selectedStory.image)}
                muted={true}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <X className="w-4 h-4" />
              </Button>
              <Badge className={`absolute top-4 left-4 ${getCategoryColor(selectedStory.category)} border-0`}>
                {selectedStory.category}
              </Badge>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedStory.title}</h2>

              <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {selectedStory.date}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedStory.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {selectedStory.attendees} attendees
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {selectedStory.description}
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Highlights</h3>
                <ul className="space-y-2">
                  {selectedStory.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <LikeButton
                  itemId={selectedStory.id.toString()}
                  itemType="story"
                  initialCount={selectedStory.likes}
                  size="md"
                  variant="outline"
                  className="flex items-center"
                />
                <Button variant="outline" className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instagram-style Viewer for Gallery */}
      <InstagramViewer
        story={selectedStory}
        initialImageIndex={selectedImageIndex}
        isOpen={isInstagramViewerOpen}
        onClose={() => {
          setIsInstagramViewerOpen(false);
          setSelectedStory(null);
        }}
      />

      {/* Traditional Detail Modal for Grid */}
      <StoryDetailModal
        story={selectedStory}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStory(null);
        }}
        storyLikes={storyLikes}
      />
    </section>
  );
};

export default StoriesSection;