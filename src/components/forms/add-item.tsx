"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  // Button,
  FormControl,
  FormLabel,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Autocomplete,
  // IconButton,
  FormHelperText,
} from "@mui/material";
// import { CloudUpload } from "@mui/icons-material";
// import type { MenuItem } from "@/types";
import dynamic from "next/dynamic";
import { uploadImageToStorage, validateImage } from '@/lib/utils';
import MenuItemImageUpload from "./menu-item-image-upload";
import ImageCropDialog from "./image-crop";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: "200px", bgcolor: "action.hover", borderRadius: 1 }} />
  ),
});

import "react-quill-new/dist/quill.snow.css";
import { itemSchema, ItemSchemaType } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/toastContext";
import LoadingButton from "../ui/loading-button";
import { useMenu } from "@/context/menuContext";
import { addMenuSectionItem } from "@/actions/actions.menu";

const commonAllergens = [
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Tree Nuts",
  "Peanuts",
  "Wheat",
  "Soybeans",
];

const commonLabels = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Spicy",
  "Chef's Special",
  "Popular",
  "New",
  "Seasonal",
];

export default function AddItemForm() {
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
      name: "",
      description: "",
      price: 0 as number,
      available: true,
      ingredients: [],
      allergens: [],
      labels: [],
    },
  });


  const params = useParams();

  const { menu, setMenu } = useMenu();



  //////////// using tanstack query for mutation of adding item  ////////////////

  const router = useRouter();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: async (data: ItemSchemaType) => {
      return await addMenuSectionItem(params.menuId as string, params.sectionId as string, data);
    },
    onSuccess: (response) => {
      if (!response.success) {
        showToast(response.error || "Failed to add item", "error");
        return;
      }
      if (menu && response.item) {
        const updatedMenu = {
          ...menu,
          sections: menu.sections.map(section => {
            if (section.id === params.sectionId) {
              return {
                ...section,
                items: [...section.items, response.item]
              };
            }
            return section;
          })
        };
        setMenu(updatedMenu);
      }
      showToast("Item added successfully", "success");

      router.refresh();
      router.push(`/restaurant/menu/${params.menuId}`);
      // reset(); // Reset form
    },
    onError: (error: Error) => {
      console.error("Error adding item:", error);
      showToast(error.message || "Failed to add item", "error");
    },
  });

  // Add this helper function for image upload


  const onSubmit = async (data: ItemSchemaType) => {
    try {
      let photoURL = null;
      
      if (itemImage) {
        showToast('Uploading image...', 'info');
        photoURL = await uploadImageToStorage(itemImage);
      }
  
      // Add the photo URL to the form data
      const formData = {
        ...data,
        photo: photoURL // This will be stored in item.photo
      };
  
      console.log("Form data:", formData);
      mutation.mutate(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast('Failed to upload image', 'error');
    }
  };

  const [ingredientInput, setIngredientInput] = useState("");

  const editorModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  // Add new state for image handling
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validation = await validateImage(file, 'background'); // Using background config for larger images
      if (!validation.valid) {
        showToast(validation.error || 'Invalid image', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setImagePreview(croppedImageUrl);
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        setItemImage(new File([blob], 'item.jpg', { type: 'image/jpeg' }));
      });
  };

  const handleDeleteImage = () => {
    setItemImage(null);
    setImagePreview(null);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Typography variant="h6" gutterBottom>
          Add New Menu Item
        </Typography>

        {/* Top Row - Basic Info and Status */}
        {/* Top Row - Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name and Price Column */}
          <div className="space-y-4">
            <FormControl fullWidth error={!!errors.name}>
              <FormLabel>Item Name</FormLabel>
              <TextField
                {...register("name")}
                placeholder="Enter item name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Price</FormLabel>
              <TextField
                type="number"
                placeholder="0.00"
                {...register("price", {
                  valueAsNumber: true,
                  setValueAs: (value) => (value === "" ? undefined : parseFloat(value))
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                InputProps={{
                  startAdornment: (
                    <Typography sx={{ mr: 1, color: "text.secondary" }}>$</Typography>
                  ),
                }}
              />
            </FormControl>

            <FormControlLabel
              control={<Switch {...register("available")} defaultChecked />}
              label="Available for Order"
            />
          </div>

          {/* Image Upload Column */}
          <MenuItemImageUpload
            preview={imagePreview}
            onUpload={handleImageUpload}
            onDelete={handleDeleteImage}
          />
        </div>

        {/* Middle Row - Dietary Info */}
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
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.allergens}
                  helperText={errors.allergens?.message}
                  placeholder="Select allergens"
                  sx={{
                    '& .MuiInputBase-root': {
                      p: '6px 9px',
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
          <div className="flex gap-2">
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
            />
          </div>
          {errors.ingredients && (
            <FormHelperText error>{errors.ingredients.message}</FormHelperText>
          )}
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {watch("ingredients").map((ingredient) => (
              <Chip
                key={ingredient}
                label={ingredient}
                onDelete={() => setValue("ingredients", watch("ingredients").filter((i) => i !== ingredient))}
              />
            ))}
          </Box>
        </FormControl>

        {/* Description at Bottom */}
        <FormControl fullWidth error={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Box sx={{
            ".ql-container": {
              borderBottomLeftRadius: 1,
              borderBottomRightRadius: 1,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: errors.description ? "error.main" : "divider",
            },
            ".ql-toolbar": {
              borderTopLeftRadius: 1,
              borderTopRightRadius: 1,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: errors.description ? "error.main" : "divider",
              borderBottom: "none",
            },
            ".ql-editor": {
              minHeight: "200px",
              fontSize: "1rem",
              fontFamily: "inherit",
              bgcolor: "action.hover",
            }
          }}>
            <ReactQuill
              value={watch("description")}
              onChange={(content) => {
                setValue("description", content);
                if (content.length >= 10) clearErrors("description");
              }}
              modules={editorModules}
              placeholder="Enter item description..."
            />
          </Box>
          {errors.description && (
            <FormHelperText error>{errors.description.message}</FormHelperText>
          )}
        </FormControl>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <LoadingButton
            variant="outlined"
            color="inherit"
            onClick={() => reset()}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            isLoading={mutation.isPending}
            loadingText="Adding Item..."
          >
            Add Item
          </LoadingButton>
        </div>
      </form>

      <ImageCropDialog
        key={currentImage}
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageUrl={currentImage || ''}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />
    </Paper>
  );
}
