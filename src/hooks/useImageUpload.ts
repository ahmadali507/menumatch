"use client";
import { useState } from 'react';
import { validateImage } from '@/lib/utils';
import { ImageState, ImageType, CurrentImage } from '@/types/image';
import { useToast } from '@/context/toastContext';

export const useImageUpload = () => {
  const [images, setImages] = useState<ImageState>({
    logo: { file: null, preview: null },
    background: { file: null, preview: null }
  });
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<CurrentImage | null>(null);
  const { showToast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: ImageType) => {
    const file = e.target.files?.[0] || null;
    e.target.value = ''; // Reset the input to allow the same file to be selected again

    if (file) {
      const validation = await validateImage(file, type);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid image', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Revoke any previous object URL to prevent memory leaks
        if (images[type].preview) {
          URL.revokeObjectURL(images[type].preview);
        }

        setCurrentImage({
          type,
          url: reader.result as string
        });
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (!currentImage) return;

    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${currentImage.type}.jpg`, { type: 'image/jpeg' });

        // Revoke the old preview URL if it exists
        if (images[currentImage.type].preview) {
          URL.revokeObjectURL(images[currentImage.type].preview!);
        }

        setImages(prev => ({
          ...prev,
          [currentImage.type]: {
            file,
            preview: croppedImageUrl
          }
        }));
      });
  };

  const handleDeleteImage = (type: ImageType) => {
    // Revoke the object URL to prevent memory leaks
    if (images[type].preview) {
      URL.revokeObjectURL(images[type].preview);
    }

    setImages(prev => ({
      ...prev,
      [type]: { file: null, preview: null }
    }));
  };

  return {
    images,
    currentImage,
    cropDialogOpen,
    handleImageUpload,
    handleCropComplete,
    handleDeleteImage,
    setCropDialogOpen,
  };
};