// Image utility functions for project uploads

export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64 with compression
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image size should be less than 5MB' };
  }

  // Check image dimensions (optional)
  return { valid: true };
};

export const generateImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};