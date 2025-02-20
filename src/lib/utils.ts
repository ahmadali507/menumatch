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
    minHeight: 200,
  },
  background: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    minWidth: 800,
    minHeight: 600,
  },
  item: {
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    minWidth: 200,
    minHeight: 200,
  }
};

export const validateImage = async (
  file: File,
  type: keyof typeof IMAGE_CONFIG
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


export const RAMADAN_DATES = {
  2024: { start: new Date(2024, 2, 11), end: new Date(2024, 3, 9) },
  2025: { start: new Date(2025, 2, 1), end: new Date(2025, 2, 30) },
  2026: { start: new Date(2026, 1, 18), end: new Date(2026, 2, 19) },
  2027: { start: new Date(2027, 1, 7), end: new Date(2027, 2, 8) },
  2028: { start: new Date(2028, 0, 27), end: new Date(2028, 1, 25) },
  2029: { start: new Date(2029, 0, 16), end: new Date(2029, 1, 14) },
  2030: { start: new Date(2030, 0, 5), end: new Date(2030, 1, 3) },
  2031: { start: new Date(2030, 11, 26), end: new Date(2031, 0, 24) },
  2032: { start: new Date(2031, 11, 15), end: new Date(2032, 0, 13) },
  2033: { start: new Date(2032, 11, 4), end: new Date(2033, 0, 2) },
  2034: { start: new Date(2033, 10, 23), end: new Date(2033, 11, 22) },
} as const;