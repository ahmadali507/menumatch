import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useState } from 'react';

interface ImageCropDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio: number;
}

export default function ImageCropDialog({
  open,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: aspectRatio >= 1 ? 90 : 90 * aspectRatio,
    height: aspectRatio >= 1 ? 90 / aspectRatio : 90,
    x: 5,
    y: 5,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const getCroppedImg = () => {
    if (!imageRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    // Set canvas size to match the cropped area
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        // Clean up previous ObjectURL if it exists
        URL.revokeObjectURL(imageUrl);
        const croppedImageUrl = URL.createObjectURL(blob);
        onCropComplete(croppedImageUrl);
        onClose();
      }
    }, 'image/jpeg', 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '900px',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #e0e0e0',
        bgcolor: 'background.default',
        py: 2
      }}>
        <div>
          <div className="text-lg font-semibold">
            Crop {aspectRatio === 1 ? 'Logo' : 'Background'} Image
          </div>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {aspectRatio === 1
              ? 'Create a square crop for your logo'
              : 'Adjust the crop area for your background image'}
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        overflow: 'hidden'
      }}>
        <div className="relative w-full h-full flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspectRatio}
            className="flex items-center justify-center max-h-full"
            style={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              onLoad={(e) => setImageRef(e.target as HTMLImageElement)}
              alt="Crop preview"
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 200px)',
                objectFit: 'contain'
              }}
            />
          </ReactCrop>
        </div>
      </DialogContent>

      <DialogActions sx={{
        p: 2,
        borderTop: '1px solid #e0e0e0',
        bgcolor: 'background.default'
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={getCroppedImg}
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Apply Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
}