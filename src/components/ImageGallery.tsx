import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

const ImageGallery = ({ images, title, className = '' }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  // Single image display
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openLightbox(0)}
        />
      </div>
    );
  }

  // Multiple images - create a collage
  return (
    <>
      <div className={`relative overflow-hidden ${className}`}>
        {images.length === 2 ? (
          // Two images side by side
          <div className="grid grid-cols-2 gap-1 h-full">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        ) : images.length === 3 ? (
          // Three images - one large, two small
          <div className="grid grid-cols-2 gap-1 h-full">
            <img
              src={images[0]}
              alt={`${title} 1`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(0)}
            />
            <div className="grid grid-rows-2 gap-1">
              <img
                src={images[1]}
                alt={`${title} 2`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(1)}
              />
              <img
                src={images[2]}
                alt={`${title} 3`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(2)}
              />
            </div>
          </div>
        ) : (
          // Four or more images - 2x2 grid with overlay for additional images
          <div className="grid grid-cols-2 gap-1 h-full">
            {images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(index)}
              />
            ))}
            <div className="relative">
              <img
                src={images[3]}
                alt={`${title} 4`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openLightbox(3)}
              />
              {images.length > 4 && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-70 transition-all"
                  onClick={() => openLightbox(3)}
                >
                  <span className="text-white text-lg font-bold">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 text-white hover:bg-white/20 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 text-white hover:bg-white/20 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;