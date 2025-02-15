import { clsx, type ClassValue } from "clsx"
import { storage } from "../firebase/firebaseconfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const IMAGE_CONFIG = {
  logo: {
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    minWidth: 200,
    // maxWidth: 2048,
    minHeight: 200,
    // maxHeight: 2048
  },
  background: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    minWidth: 1280,
    // maxWidth: 3840,
    minHeight: 720,
    // maxHeight: 2160
  }
};

export const validateImage = async (
  file: File,
  type: 'logo' | 'background'
): Promise<{ valid: boolean; error?: string }> => {
  const config = IMAGE_CONFIG[type];

  // Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `Image size must be less than ${config.maxSize / (1024 * 1024)}MB`
    };
  }

  // Check file format
  if (!config.acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Only ${config.acceptedFormats.map(f => f.split('/')[1]).join(', ')} formats are accepted`
    };
  }

  // Check dimensions
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width < config.minWidth || img.height < config.minHeight) {
        resolve({
          valid: false,
          error: `Image dimensions must be at least ${config.minWidth}x${config.minHeight}px`
        });
      }
      // else if (img.width > config.maxWidth || img.height > config.maxHeight) {
      //   resolve({
      //     valid: false,
      //     error: `Image dimensions must not exceed ${config.maxWidth}x${config.maxHeight}px`
      //   });
      // } 
      else {
        resolve({ valid: true });
      }
    };
    img.onerror = () => {
      resolve({ valid: false, error: 'Failed to load image' });
    };
  });
};



  export const uploadImageToStorage = async (file: File): Promise<string> => {
    if (!file) throw new Error('No file provided');
    
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `menu-items/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (!downloadURL) {
        throw new Error('Failed to get download URL');
      }
      
      return downloadURL;
    } catch (error) {
      console.error('Storage error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload image to storage'
      );
    }
  };