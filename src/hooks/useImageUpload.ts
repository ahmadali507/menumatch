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
    if (file) {
      const validation = await validateImage(file, type);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid image', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
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
