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
import {  CloudUpload } from "@mui/icons-material";
// import type { MenuItem } from "@/types";
import dynamic from "next/dynamic";

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
import { addMenuSectionItem } from "@/actions/actions.menu";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/toastContext";
import LoadingButton from "../ui/loading-button";
import { useMenu } from "@/context/menuContext";

// Predefined options
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

  const {menu, setMenu} = useMenu(); 



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
  const onSubmit = async (data: ItemSchemaType) => {
    try {
      console.log("Form data:", data);
      // // Add your submission logic here
      mutation.mutate(data);
    } catch (error) {
      console.error("Error submitting form:", error);
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


  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Typography variant="h6" gutterBottom>
          Add New Menu Item
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Item Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{
                "& .MuiInputLabel-root": {
                  backgroundColor: "background.paper",
                  px: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    top: 0,
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <FormControl fullWidth error={!!errors.description}>
              <FormLabel
                sx={{
                  mb: 1,
                  color: "text.primary",
                  "&.Mui-focused": { color: "primary.main" },
                }}
              >
                Description
              </FormLabel>
              <Box
                sx={{
                  ".ql-container": {
                    borderBottomLeftRadius: 1,
                    borderBottomRightRadius: 1,
                    bgcolor: "action.hover", // Changed this line
                    border: "1px solid",
                    borderColor: "divider",
                  },
                  ".ql-toolbar": {
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                    bgcolor: "action.hover", // Changed this line
                    border: "1px solid",
                    borderColor: "divider",
                    borderBottom: "none",
                  },
                  ".ql-editor": {
                    minHeight: "100px",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    bgcolor: "action.hover", // Changed this line
                    "&.ql-blank::before": {
                      color: "text.secondary",
                    },
                  },
                }}
              >
                <ReactQuill
                  value={watch("description")}
                  onChange={(content) => {
                    // const plainText = stripHtml(content); 
                    setValue("description", content);
                    if (content.length >= 10) clearErrors("description");
                  }}
                  modules={editorModules}
                  placeholder="Enter item description..."
                />
              </Box>
              {errors.description && (
                <FormHelperText error>
                  {errors.description.message}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Price"
              placeholder="0.00"
              type="number"
              {...register("price", {
    valueAsNumber: true, // This converts string to number
    setValueAs: (value) => (value === "" ? undefined : parseFloat(value))
  })}
              error={!!errors.price}
              helperText={errors.price?.message}
              InputProps={{
                startAdornment: (
                  <Typography
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                      userSelect: "none",
                    }}
                  >
                    $
                  </Typography>
                ),
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <FormControl fullWidth>
              <FormLabel>Item Image</FormLabel>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
                component="label"
              >
                <input type="file" hidden accept="image/*" />
                <div className="flex flex-col items-center gap-2">
                  <CloudUpload sx={{ fontSize: 40, color: "text.secondary" }} />
                  <Typography color="text.secondary">
                    Drag and drop or click to upload
                  </Typography>
                </div>
              </Box>
            </FormControl>

            <FormControlLabel
              control={<Switch {...register("available")} defaultChecked />}
              label="Available for Order"
            />
          </div>
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
                  const newIngredients = [
                    ...watch("ingredients"),
                    ingredientInput.trim(),
                  ];
                  setValue("ingredients", newIngredients);
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
                onDelete={() => {
                  const newIngredients = watch("ingredients").filter(
                    (i) => i !== ingredient
                  );
                  setValue("ingredients", newIngredients);
                }}
              />
            ))}
          </Box>
        </FormControl>

        {/* Allergens and Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.allergens}
                  helperText={errors.allergens?.message}
                  placeholder="Select allergens"
                  sx={{
                    "& .MuiInputBase-root": {
                      minHeight: 56,
                      alignItems: "center",
                      padding: "0 14px",
                    },
                    "& .MuiInputBase-input": {
                      width: "100% !important",
                      padding: "4px 0 !important",
                    },
                    "& .MuiAutocomplete-clearIndicator": {
                      padding: "2px",
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                      padding: "2px",
                    },
                  }}
                />
              )}
              renderTags={() => null}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                mt: 1,
              }}
            >
              {watch("allergens").map((allergen) => (
                <Chip
                  key={allergen}
                  label={allergen}
                  onDelete={() =>
                    setValue(
                      "allergens",
                      watch("allergens").filter((a) => a !== allergen)
                    )
                  }
                  color="error"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </FormControl>

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
                    "& .MuiInputBase-root": {
                      minHeight: 56,
                      alignItems: "center",
                      padding: "0 14px",
                    },
                    "& .MuiInputBase-input": {
                      width: "100% !important",
                      padding: "4px 0 !important",
                    },
                    "& .MuiAutocomplete-clearIndicator": {
                      padding: "2px",
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                      padding: "2px",
                    },
                  }}
                />
              )}
              renderTags={() => null}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                mt: 1,
              }}
            >
              {watch("labels").map((label) => (
                <Chip
                  key={label}
                  label={label}
                  onDelete={() =>
                    setValue(
                      "labels",
                      watch("labels").filter((l) => l !== label)
                    )
                  }
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </FormControl>
        </div>

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
    </Paper>
  );
}
