// Media utility functions for handling images and videos

export type MediaType = 'image' | 'video' | 'unknown';

export const getMediaType = (url: string): MediaType => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv'];
  
  if (imageExtensions.includes(extension || '')) {
    return 'image';
  }
  
  if (videoExtensions.includes(extension || '')) {
    return 'video';
  }
  
  return 'unknown';
};

export const isImage = (url: string): boolean => {
  return getMediaType(url) === 'image';
};

export const isVideo = (url: string): boolean => {
  return getMediaType(url) === 'video';
};

export const getMediaDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (isImage(url)) {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    } else if (isVideo(url)) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });
      video.onerror = reject;
      video.src = url;
    } else {
      reject(new Error('Unsupported media type'));
    }
  });
};

export const createMediaElement = (url: string, className?: string): HTMLElement => {
  if (isImage(url)) {
    const img = document.createElement('img');
    img.src = url;
    img.className = className || '';
    img.alt = 'Media content';
    return img;
  } else if (isVideo(url)) {
    const video = document.createElement('video');
    video.src = url;
    video.className = className || '';
    video.controls = true;
    video.preload = 'metadata';
    return video;
  } else {
    const div = document.createElement('div');
    div.textContent = 'Unsupported media type';
    div.className = className || '';
    return div;
  }
};