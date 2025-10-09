import React from 'react';
import { isVideo, isImage } from '../utils/mediaUtils';

interface MediaViewerProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  src,
  alt = 'Media content',
  className = '',
  style,
  onClick,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false
}) => {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        onClick={onClick}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload="metadata"
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (isImage(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onClick={onClick}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-gray-200 text-gray-500`} style={style}>
      <span>Unsupported media type</span>
    </div>
  );
};

export default MediaViewer;