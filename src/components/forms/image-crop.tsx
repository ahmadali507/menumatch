import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useState, useEffect, useCallback, useRef } from 'react';

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
    unit: 'px',
    width: 200,
    height: 200,
    x: 5,
    y: 5,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // This function centers the initial crop
  const centerAspectCrop = useCallback(
    (mediaWidth: number, mediaHeight: number, aspect: number) => {
      return centerCrop(
        makeAspectCrop(
          {
            unit: 'px',
            width: 200,
            height: 200,
            x: 5,
            y: 5,
          },
          aspect,
          mediaWidth,
          mediaHeight
        ),
        mediaWidth,
        mediaHeight
      );
    },
    []
  );

  // Function to handle image load
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setImageRef(e.currentTarget);

      // Center and create the initial crop with proper aspect ratio
      const newCrop = centerAspectCrop(width, height, aspectRatio);
      setCrop(newCrop);
      // Immediately set the completed crop as well - this is the key workaround
      setCompletedCrop(newCrop);
    },
    [aspectRatio, centerAspectCrop]
  );

  // Function to simulate crop box interaction
  const simulateCropBoxInteraction = useCallback(() => {
    if (cropContainerRef.current) {
      const cropBox = cropContainerRef.current.querySelector('.ReactCrop__crop-selection');
      if (cropBox) {
        // Create and dispatch mouse events
        const clickEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        cropBox.dispatchEvent(clickEvent);

        // Small timeout before dispatching mouseup
        setTimeout(() => {
          const releaseEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          cropBox.dispatchEvent(releaseEvent);
        }, 50);
      }
    }
  }, []);

  // Effect to trigger crop box interaction after image load
  useEffect(() => {
    if (open && imageRef && crop) {
      const timer = setTimeout(() => {
        simulateCropBoxInteraction();
      }, 100); // Small delay to ensure the crop box is rendered

      return () => clearTimeout(timer);
    }
  }, [open, imageRef, crop, simulateCropBoxInteraction]);

  // Reset when image URL changes
  // useEffect(() => {
  //   if (!imageUrl) {
  //     setCrop({
  //       unit: '%',
  //       width: 90,
  //       height: 90,
  //       x: 5,
  //       y: 5,
  //     });
  //     setCompletedCrop(null);
  //   }
  // }, [imageUrl]);

  // Make sure to trigger completedCrop when the dialog opens
  useEffect(() => {
    if (open && imageRef && crop) {
      setCompletedCrop(crop);
    }
  }, [open, imageRef, crop]);

  console.log("complted crop", completedCrop)

  const getCroppedImg = () => {
    if (!imageRef || !completedCrop) return;

    console.log(completedCrop)

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to blob and pass to the callback
    canvas.toBlob((blob) => {
      if (blob) {
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
        <div className="relative w-full h-full flex items-center justify-center" ref={cropContainerRef}>
          {imageUrl && (
            <ReactCrop
              crop={crop}
              onChange={(c) => {
                setCrop(c);
                // Also update completedCrop on any change - part of the workaround
                setCompletedCrop(c);
              }}
              onComplete={(c) => setCompletedCrop(c)}
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
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 200px)',
                  objectFit: 'contain'
                }}
              />
            </ReactCrop>
          )}
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
          disabled={!imageRef || !imageUrl || !completedCrop}
        >
          Apply Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
}