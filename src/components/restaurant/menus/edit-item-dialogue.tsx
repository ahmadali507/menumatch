'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  Switch,
  FormControlLabel,
  Box,
  Autocomplete,
  Chip,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemSchemaType } from '@/lib/schema';
import { useMutation } from '@tanstack/react-query';
import { updateSectionItem } from '@/actions/actions.menu';
import { useToast } from '@/context/toastContext';
import { useState } from 'react';
import LoadingButton from '@/components/ui/loading-button';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MenuItem } from '@/types';
import { commonAllergens, commonLabels } from '@/lib/dummy';
// import { useTheme } from '@mui/material/styles';
import MenuItemImageUpload from '@/components/forms/menu-item-image-upload';
import ImageCropDialog from '@/components/forms/image-crop';
import { validateImage } from '@/lib/utils';
import { useMenu } from '@/context/menuContext';

interface EditItemDialogProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem;
  menuId: string;
  sectionId: string;
}
export default function EditItemDialog({ open, onClose, item, menuId, sectionId }: EditItemDialogProps) {
//   const theme = useTheme();
//   const { showToast } = useToast();
  const [currentImage, setCurrentImage] = useState<string | null>(item.photo || null);
  const [imagePreview, setImagePreview] = useState<string | null>(item.photo || null);
  const [, setItemImage] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const { showToast } = useToast();
  const [ingredientInput, setIngredientInput] = useState("");

  const {menu, setMenu} = useMenu(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    reset
  } = useForm<ItemSchemaType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      price: item.price,
      ingredients: item.ingredients,
      allergens: item.allergens,
      labels: item.labels,
      available: item.available,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ItemSchemaType) => {
      return await updateSectionItem(menuId, sectionId, item.id as string , data);
    },
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response.error || 'Failed to update item', 'error');
        return;
      }


        // Update the menu state with the new item data
        if(response.success && menu && response.item){
            const updatedMenu = {
                ...menu,
                sections: menu?.sections.map(section => 
                section.id === sectionId
                    ? { ...section, items: section.items.map(item => 
                    item.id === response.item.id
                        ? response.item
                        : item
                    ) }
                    : section
                )
            };
            setMenu(updatedMenu);
        }
      showToast('Item updated successfully', 'success');
      onClose();
    },
    onError: (error: Error) => {
      showToast('Failed to update item', 'error');
      console.error('Error updating item:', error);
    }
  });

  const onSubmit = (data: ItemSchemaType) => {
    mutation.mutate(data);
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const validation = await validateImage(file, 'background');
      if (!validation.valid) {
        showToast(validation.error || 'Invalid image', 'error');
        return;
      }
  
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      setCurrentImage(fileUrl);
      setCropDialogOpen(true);
    } catch (error) {
      showToast('Error processing image', 'error');
      console.error('Error handling image upload:', error);
    }
  };
  
  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'item.jpg', { type: 'image/jpeg' });
      
      setItemImage(file);
      setImagePreview(croppedImageUrl);
      setCropDialogOpen(false);
    } catch (error) {
      showToast('Error processing cropped image', 'error');
      console.error('Error handling crop complete:', error);
    }
  };
  
  const handleDeleteImage = () => {
    setItemImage(null);
    setImagePreview(null);
    setCurrentImage(null);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 3,
        py: 2
      }}>
        Edit Menu Item
      </DialogTitle>

      <DialogContent sx={{ 
        p: 0,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '4px'
        }
      }}>
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          sx={{ p: 3 }}
          className="space-y-6"
        >
          {/* Top Row - Basic Info and Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name, Price, and Availability */}
            <div className="space-y-4">
              <FormControl fullWidth error={!!errors.name}>
                <FormLabel>Item Name</FormLabel>
                <TextField
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Price</FormLabel>
                <TextField
                  type="number"
                  inputProps={{ step: "0.01" }}
                  {...register("price", { valueAsNumber: true })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Switch 
                    {...register("available")} 
                    defaultChecked={item.available}
                  />
                }
                label="Available for Order"
              />
            </div>

            {/* Image Upload - Add your MenuItemImageUpload component here */}
            <MenuItemImageUpload
              preview={imagePreview || item.photo || null}
              onUpload={handleImageUpload}
              onDelete={handleDeleteImage}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allergens */}
          <FormControl fullWidth error={!!errors.allergens}>
            <FormLabel>Allergens</FormLabel>
            <Autocomplete
              multiple
              options={commonAllergens}
              value={watch("allergens")}
              onChange={(_, newValue) => {
                setValue("allergens", newValue);
                clearErrors("allergens");
              }}
              sx={{
                '& .MuiAutocomplete-popupIndicator': {
                  transform: 'none',
                  border: 'none',
                  p: 0.5,
                  ml: -0.5,
                },
                '& .MuiInputBase-root': {
                  bgcolor: 'action.hover',
                  p: '6px 9px',
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.allergens}
                  helperText={errors.allergens?.message}
                  placeholder="Select allergens"
                />
              )}
              renderTags={() => null}
            />
            <Box sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mt: 1,
              minHeight: '32px',
              padding: '4px 0'
            }}>
              {watch("allergens").map((allergen) => (
                <Chip
                  key={allergen}
                  label={allergen}
                  onDelete={() => setValue("allergens", watch("allergens").filter((a) => a !== allergen))}
                  color="error"
                  variant="filled"
                  size="small"
                  sx={{
                    borderRadius: '4px',
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          </FormControl>

          {/* Labels */}
          <FormControl fullWidth error={!!errors.labels}>
            <FormLabel>Labels</FormLabel>
            <Autocomplete
              multiple
              options={commonLabels}
              value={watch("labels")}
              onChange={(_, newValue) => {
                setValue("labels", newValue);
                clearErrors("labels");
              }}

              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.labels}
                  helperText={errors.labels?.message}
                  placeholder="Select labels"
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: '3px 9px',
                    }
                  }}
                />
              )}
              renderTags={() => null}
            />
            <Box sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mt: 1,
              minHeight: '32px',
              padding: '4px 0'
            }}>
              {watch("labels").map((label) => (
                <Chip
                  key={label}
                  label={label}
                  onDelete={() => setValue("labels", watch("labels").filter((l) => l !== label))}
                  color="primary"
                  variant="filled"
                  size="small"
                  sx={{
                    borderRadius: '4px',
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          </FormControl>
        </div>

        {/* Ingredients */}
        <FormControl fullWidth error={!!errors.ingredients}>
          <FormLabel>Ingredients</FormLabel>
          <TextField
            fullWidth
            placeholder="Add ingredient and press Enter"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ingredientInput.trim()) {
                e.preventDefault();
                setValue("ingredients", [...watch("ingredients"), ingredientInput.trim()]);
                setIngredientInput("");
                clearErrors("ingredients");
              }
            }}
            error={!!errors.ingredients}
            helperText={errors.ingredients?.message}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: 'action.hover'
              }
            }}
          />
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            mt: 1,
            minHeight: '32px',
            padding: '4px 0'
          }}>
            {watch("ingredients").map((ingredient) => (
              <Chip
                key={ingredient}
                label={ingredient}
                onDelete={() => setValue("ingredients", 
                  watch("ingredients").filter((i) => i !== ingredient)
                )}
                color="default"
                variant="filled"
                size="small"
                sx={{
                  borderRadius: '4px',
                  fontWeight: 500
                }}
              />
            ))}
          </Box>
        </FormControl>

          {/* Description */}
          <FormControl fullWidth error={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Box sx={{
              '.ql-container': {
                borderBottomLeftRadius: 1,
                borderBottomRightRadius: 1,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: errors.description ? 'error.main' : 'divider',
              },
              '.ql-toolbar': {
                borderTopLeftRadius: 1,
                borderTopRightRadius: 1,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: errors.description ? 'error.main' : 'divider',
                borderBottom: 'none',
              },
              '.ql-editor': {
                minHeight: '200px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                bgcolor: 'action.hover',
              }
            }}>
              <ReactQuill
                value={watch("description")}
                onChange={(content) => {
                  setValue("description", content);
                  if (content.length >= 10) clearErrors("description");
                }}
                placeholder="Enter item description..."
              />
            </Box>
            {errors.description && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors.description.message}
              </Typography>
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <LoadingButton
          onClick={() => {
            reset();
            onClose();
          }}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          isLoading={mutation.isPending}
          variant="contained"
          color="primary"
          loadingText="Updating..."
        >
          Update Item
        </LoadingButton>
      </DialogActions>

      <ImageCropDialog
        key={currentImage} // This ensures the component resets when image changes
        open={cropDialogOpen}
        onClose={() => {
          setCropDialogOpen(false);
          setCurrentImage(null);
        }}
        imageUrl={currentImage || ''}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />
    </Dialog>
  );
}