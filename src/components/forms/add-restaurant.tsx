"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Typography,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Paper,
  // MenuItem,
  // Select,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createRestaurant } from "@/actions/actions.admin";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/ui/loading-button";
import { useToast } from "@/context/toastContext";
import { addRestaurantSchema, TAddRestaurantSchema } from "@/lib/schema";
import { auth } from "@/firebase/firebaseconfig";
import { locationData } from "@/lib/dummy";
import Autocomplete from "@mui/material/Autocomplete";
// import { locationData } from "@/lib/data/locations";

export default function AddRestaurantForm() {
  const router = useRouter();
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { showToast } = useToast();
  /// creating a mutation using reactQuery.....

  const mutation = useMutation({
    mutationFn: async (data: TAddRestaurantSchema) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found");
      }
      const idToken = await user.getIdToken(true);
      return createRestaurant(data, idToken);
    },
    onSuccess: (response) => {
      console.log("Response from createRestaurant", response);
      if (response.success) {
        showToast("Restaurant created successfully", "success");
        setTimeout(() => {
          router.push(`/restaurants/${response.restaurantId}`);
        }, 1000);
      } else {
        showToast(response.error || "Failed to create restaurant", "error");
      }
    },
    onError: (error) => {
      //TODO: inroduce toasts to handle errors in an efficient way....
      showToast("Error creating restaurant", "error");
      console.log("Error creating restaurant:", error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddRestaurantSchema>({
    resolver: zodResolver(addRestaurantSchema),
  });

  const onSubmit = async (data: TAddRestaurantSchema) => {
    // Handle form submission
    mutation.mutate(data);

    console.log(data, logo, background);
    //  Replace 123 with actual ID
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Details */}
      <div className="space-y-3">
        <Typography variant="h6">Basic Details</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormControl fullWidth error={!!errors.name}>
            <FormLabel>Restaurant Name</FormLabel>
            <TextField
              {...register("name")}
              placeholder="e.g. The Italian Place"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </FormControl>
          <FormControl fullWidth error={!!errors.cuisine}>
            <FormLabel>Cuisine</FormLabel>
            <TextField
              {...register("cuisine")}
              placeholder="e.g. The Italian Place"
              error={!!errors.cuisine}
              helperText={errors.cuisine?.message}
            />
          </FormControl>
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-3">
        <Typography variant="h6">Location</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormControl fullWidth error={!!errors.location?.address}>
            <FormLabel>Address</FormLabel>
            <TextField
              {...register("location.address")}
              placeholder="Street Address"
              error={!!errors.location?.address}
              helperText={errors.location?.address?.message}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Country</FormLabel>
            <Autocomplete
              value={selectedCountry}
              onChange={(_, newValue) => {
                setSelectedCountry(newValue || "");
                setSelectedState("");
                setSelectedCity("");
                register("location.country").onChange({
                  target: { value: newValue },
                });
              }}
              options={Object.keys(locationData)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select country" />
              )}
              componentsProps={{
                popper: {
                  sx: {
                    "& .MuiAutocomplete-listbox": {
                      maxHeight: "100px",
                    },
                  },
                },
              }}
              sx={{
                "& .MuiAutocomplete-clearIndicator": {
                  padding: "2px",
                  border: "none",
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    fontSize: "16px",
                  },
                },
                "& .MuiAutocomplete-popupIndicator": {
                  padding: "2px",
                  border: "none",
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>State</FormLabel>
            <Autocomplete
              value={selectedState}
              onChange={(_, newValue) => {
                setSelectedState(newValue || "");
                setSelectedCity("");
                register("location.state").onChange({
                  target: { value: newValue },
                });
              }}
              options={
                selectedCountry
                  ? Object.keys(locationData[selectedCountry].states)
                  : []
              }
              disabled={!selectedCountry}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select state" />
              )}
              componentsProps={{
                popper: {
                  sx: {
                    "& .MuiAutocomplete-listbox": {
                      maxHeight: "100px",
                    },
                  },
                },
              }}
              sx={{
                "& .MuiAutocomplete-clearIndicator": {
                  padding: "2px",
                  border: "none",
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    fontSize: "16px",
                  },
                },
                "& .MuiAutocomplete-popupIndicator": {
                  padding: "2px",
                  border: "none",
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>City</FormLabel>
            <Autocomplete
              value={selectedCity}
              onChange={(_, newValue) => {
                setSelectedCity(newValue || "");
                register("location.city").onChange({
                  target: { value: newValue },
                });
              }}
              options={
                selectedCountry && selectedState
                  ? locationData[selectedCountry].states[selectedState]
                  : []
              }
              disabled={!selectedState}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select city" />
              )}
              componentsProps={{
                popper: {
                  sx: {
                    "& .MuiAutocomplete-listbox": {
                      maxHeight: "100px",
                    },
                  },
                },
              }}
              sx={{
                "& .MuiAutocomplete-clearIndicator": {
                  padding: "2px",
                  border: "none",
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    fontSize: "16px",
                  },
                },
                "& .MuiAutocomplete-popupIndicator": {
                  padding: "2px",
                  border: "none",
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                  },
                },
              }}
            />
          </FormControl>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-3">
        <Typography variant="h6">Contact Information</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormControl fullWidth error={!!errors.contact?.phone}>
            <FormLabel>Phone</FormLabel>
            <TextField
              {...register("contact.phone")}
              placeholder="+1 (555) 000-0000"
              error={!!errors.contact?.phone}
              helperText={errors.contact?.phone?.message}
            />
          </FormControl>
          <FormControl fullWidth error={!!errors.contact?.email}>
            <FormLabel>Email</FormLabel>
            <TextField
              {...register("contact.email")}
              placeholder="restaurant@example.com"
              error={!!errors.contact?.email}
              helperText={errors.contact?.email?.message}
            />
          </FormControl>
        </div>
      </div>

      {/* Image Uploads */}
      <div className="space-y-3">
        <Typography variant="h6">Images</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <FormLabel>Logo</FormLabel>
            <Paper
              variant="outlined"
              className="mt-2 border-dashed border-2 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
              <CloudUploadIcon className="text-4xl mb-2" />
              <Typography>
                {logo ? logo.name : "Click to upload logo"}
              </Typography>
              <FormHelperText sx={{ textAlign: "center" }}>
                Recommended: 512x512px, max 2MB
              </FormHelperText>
            </Paper>
          </div>

          {/* Background Upload */}
          <div>
            <FormLabel>Background Image</FormLabel>
            <Paper
              variant="outlined"
              className="mt-2 border-dashed border-2 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
              onClick={() =>
                document.getElementById("background-upload")?.click()
              }
            >
              <input
                id="background-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setBackground(e.target.files?.[0] || null)}
              />
              <CloudUploadIcon className="text-4xl mb-2" />
              <Typography>
                {background ? background.name : "Click to upload background"}
              </Typography>
              <FormHelperText sx={{ textAlign: "center" }}>
                Recommended: 1920x1080px, max 5MB
              </FormHelperText>
            </Paper>
          </div>
        </div>
      </div>

      <LoadingButton
        type="submit"
        variant="contained"
        fullWidth
        isLoading={mutation.isPending}
        loadingText="Creating Restaurant"
        sx={{ mt: 3 }}
      >
        Create Restaurant
      </LoadingButton>
    </form>
  );
}
