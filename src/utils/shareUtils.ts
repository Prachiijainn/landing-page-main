// Utility functions for sharing content

export const generateStoryUrl = (storyId: string | number): string => {
  return `${window.location.origin}/stories/${storyId}`;
};

export const generateProjectUrl = (projectId: string | number): string => {
  return `${window.location.origin}/projects/${projectId}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

export const shareStory = async (
  storyId: string | number,
  storyTitle: string,
  onSuccess?: (url: string) => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    const url = generateStoryUrl(storyId);
    const success = await copyToClipboard(url);
    
    if (success) {
      onSuccess?.(url);
    } else {
      throw new Error('Failed to copy to clipboard');
    }
  } catch (error) {
    onError?.(error as Error);
  }
};

export const shareProject = async (
  projectId: string | number,
  projectTitle: string,
  onSuccess?: (url: string) => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    const url = generateProjectUrl(projectId);
    const success = await copyToClipboard(url);
    
    if (success) {
      onSuccess?.(url);
    } else {
      throw new Error('Failed to copy to clipboard');
    }
  } catch (error) {
    onError?.(error as Error);
  }
};

// Social media sharing URLs
export const getSocialShareUrls = (url: string, title: string, description?: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
};