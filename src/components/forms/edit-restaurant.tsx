"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  FormControl,
  FormLabel,
  MenuItem,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { editRestaurant } from "@/actions/actions.admin";
import { editRestaurantSchema, TEditRestaurant } from "@/lib/schema";
import EditIcon from "@mui/icons-material/Edit";
import LoadingButton from "../ui/loading-button";
import { auth } from "@/firebase/firebaseconfig";
import { useToast } from "@/context/toastContext";
// import { MenuItemImageUpload } from "../restaurant/menus/menu-item-image";
// import { ImageCropDialog } from "../ui/image-crop-dialog";
import { validateImage } from "@/lib/utils";
import MenuItemImageUpload from "./menu-item-image-upload";
import ImageCropDialog from "./image-crop";
import { useRouter } from "next/navigation";

interface EditRestaurantProps {
  restaurantId: string;
  initialData: TEditRestaurant & {
    images: {
      logo: string | null;
      background: string | null;
    }
  };
  iconTrigger?: boolean;
}

export default function EditRestaurant({
  restaurantId,
  initialData,
  iconTrigger
}: EditRestaurantProps) {
  const [open, setOpen] = useState(false);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<'logo' | 'background' | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData.images.logo);
  const [bgPreview, setBgPreview] = useState<string | null>(initialData.images.background);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TEditRestaurant>({
    resolver: zodResolver(editRestaurantSchema),
    defaultValues: initialData,
  });
  
  const router = useRouter(); 
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: async (data: TEditRestaurant) => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not found");

        const idToken = await user.getIdToken(true);
        const formData = new FormData();

        // Convert images to Blob before appending to FormData
        if (logoImage) {
          const logoBlob = await fetch(logoPreview!).then(r => r.blob());
          formData.append('logo', logoBlob, 'logo.jpg');
        }
        
        if (bgImage) {
          const bgBlob = await fetch(bgPreview!).then(r => r.blob());
          formData.append('background', bgBlob, 'background.jpg');
        }

        // Create and append the data payload
        const payload = {
          ...data,
          images: {
            logo: logoImage ? null : logoPreview || initialData.images.logo,
            background: bgImage ? null : bgPreview || initialData.images.background
          }
        };

        formData.append('data', JSON.stringify(payload));

        const response = await editRestaurant(restaurantId, formData, idToken);
        if (!response.success) {
          throw new Error(response.error);
        }
        return response;
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast("Restaurant updated successfully", "success");
        setOpen(false);
        // Use router.refresh() instead of window.location.reload()
        router.refresh();
      }
    },
    onError: (error: Error) => {
      console.error("Error updating restaurant:", error);
      showToast(error.message || "Failed to update restaurant", "error");
    }
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const onSubmit = (data: TEditRestaurant) => {
    try {
      mutation.mutate(data);
    } catch (error) {
      console.error("Error in form submission:", error);
      showToast("Failed to submit form", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validation = await validateImage(file, type);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid image', 'error');
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setCurrentImage(fileUrl);
      setImageType(type);
      setCropDialogOpen(true);
    } catch (error) {
      showToast('Error processing image', 'error');
      console.error('Error handling image upload:', error);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      const response = await fetch(croppedImageUrl);
      if (!response.ok) throw new Error('Failed to fetch cropped image');
      
      const blob = await response.blob();
      const file = new File([blob], `${imageType}.jpg`, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      if (imageType === 'logo') {
        setLogoImage(file);
        setLogoPreview(croppedImageUrl);
      } else {
        setBgImage(file);
        setBgPreview(croppedImageUrl);
      }

      setCropDialogOpen(false);
    } catch (error) {
      showToast('Error processing cropped image', 'error');
      console.error('Error handling crop complete:', error);
    }
  };

  return (
    <>
      {iconTrigger ? <IconButton size="small" color="primary" onClick={handleOpen}>
        <EditIcon fontSize="small" />
      </IconButton> : <Button
        type="button"
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={handleOpen}
      >
        Edit Details
      </Button>}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(17, 25, 40, 0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            "& .MuiFormLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiInputBase-root": {
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "& .MuiMenuItem-root": {
              color: "white",
            },
          },
        }}
      >
        <DialogTitle
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          Edit Restaurant
        </DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit, (error) => {
            console.log(error);
          })}
          className="space-y-4 mt-2"
        >
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Restaurant Images
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <MenuItemImageUpload
                      preview={logoPreview}
                      onUpload={(e) => handleImageUpload(e, 'logo')}
                      onDelete={() => {
                        setLogoImage(null);
                        setLogoPreview(null);
                      }}
                      // label="Logo"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MenuItemImageUpload
                      preview={bgPreview}
                      onUpload={(e) => handleImageUpload(e, 'background')}
                      onDelete={() => {
                        setBgImage(null);
                        setBgPreview(null);
                      }}
                      // label="Background"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <FormLabel>Restaurant Name</FormLabel>
                  <TextField
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="small"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <FormLabel>Cuisine</FormLabel>
                  <TextField
                    {...register("cuisine")}
                    error={!!errors.cuisine}
                    helperText={errors.cuisine?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Phone</FormLabel>
                  <TextField
                    {...register("contact.phone")}
                    error={!!errors.contact?.phone}
                    helperText={errors.contact?.phone?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    {...register("contact.email")}
                    error={!!errors.contact?.email}
                    helperText={errors.contact?.email?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Status</FormLabel>
                  <TextField
                    {...register("status")}
                    select
                    defaultValue="active"
                    size="small"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <FormLabel>Street Address</FormLabel>
                  <TextField
                    {...register("location.address")}
                    error={!!errors.location?.address}
                    helperText={errors.location?.address?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>City</FormLabel>
                  <TextField
                    {...register("location.city")}
                    error={!!errors.location?.city}
                    helperText={errors.location?.city?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>State</FormLabel>
                  <TextField
                    {...register("location.state")}
                    error={!!errors.location?.state}
                    helperText={errors.location?.state?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Country</FormLabel>
                  <TextField
                    {...register("location.country")}
                    error={!!errors.location?.country}
                    helperText={errors.location?.country?.message}
                    size="small"
                  />
                </FormControl>
              </Grid>
            </Grid>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                size="small"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                variant="contained"
                isLoading={mutation.isPending}
                loadingText="Saving"
              >
                Save Changes
              </LoadingButton>
            </div>
          </DialogContent>
        </form>
      </Dialog>

      <ImageCropDialog
        key={currentImage}
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageUrl={currentImage || ''}
        onCropComplete={handleCropComplete}
        aspectRatio={imageType === 'logo' ? 1 : 16 / 9}
      />
    </>
  );
}
