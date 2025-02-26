"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { createRestaurant } from "@/actions/actions.admin";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/ui/loading-button";
import { useToast } from "@/context/toastContext";
import { addRestaurantSchema, TAddRestaurantSchema } from "@/lib/schema";
import { auth } from "@/firebase/firebaseconfig";
import { useImageUpload } from "@/hooks/useImageUpload";
import ImageCropDialog from "./image-crop";
import ImageUpload from "./image-upload";
import { locationData } from '@/lib/dummy';

export default function AddRestaurantForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    images,
    currentImage,
    cropDialogOpen,
    handleImageUpload,
    handleCropComplete,
    handleDeleteImage,
    setCropDialogOpen,
  } = useImageUpload();

  // Add state for location dropdowns
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Add helper functions for location data
  const countries = Object.keys(locationData);
  const states = selectedCountry ? Object.keys(locationData[selectedCountry].states) : [];
  const cities = selectedCountry && selectedState ? 
    locationData[selectedCountry].states[selectedState] : [];

  const mutation = useMutation({
    mutationFn: async (data: TAddRestaurantSchema & {
      logoFile?: File | null;
      backgroundFile?: File | null
    }) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found");
      }
      const idToken = await user.getIdToken(true);

      // Create FormData to send files
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      if (data.logoFile) {
        formData.append('logo', data.logoFile);
      }
      if (data.backgroundFile) {
        formData.append('background', data.backgroundFile);
      }

      return createRestaurant(formData, idToken);
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
    setValue
  } = useForm<TAddRestaurantSchema>({
    resolver: zodResolver(addRestaurantSchema),
    defaultValues: {
      location: {
        country: '',
        state: '',
        city: '',
        address: ''
      }
    }
  });

  const onSubmit = async (data: TAddRestaurantSchema) => {
    try {
      // Add image files to the form data
      const formData = {
        ...data,
        logoFile: images.logo.file,
        backgroundFile: images.background.file
      };

      mutation.mutate(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Error creating restaurant", "error");
    }
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

          {/* Country Dropdown */}
          <FormControl fullWidth error={!!errors.location?.country}>
            <FormLabel>Country</FormLabel>
            <Select
              {...register("location.country")}
              value={selectedCountry}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCountry(value);
                setSelectedState('');
                setSelectedCity('');
                setValue('location.country', value);
                setValue('location.state', '');
                setValue('location.city', '');
              }}
              error={!!errors.location?.country}
            >
              <MenuItem value="" disabled>Select Country</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
            {errors.location?.country && (
              <FormHelperText error>{errors.location.country.message}</FormHelperText>
            )}
          </FormControl>

          {/* State Dropdown */}
          <FormControl 
            fullWidth 
            error={!!errors.location?.state}
            disabled={!selectedCountry}
          >
            <FormLabel>State</FormLabel>
            <Select
              {...register("location.state")}
              value={selectedState}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedState(value);
                setSelectedCity('');
                setValue('location.state', value);
                setValue('location.city', '');
              }}
              error={!!errors.location?.state}
            >
              <MenuItem value="" disabled>Select State</MenuItem>
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {errors.location?.state && (
              <FormHelperText error>{errors.location.state.message}</FormHelperText>
            )}
          </FormControl>

          {/* City Dropdown */}
          <FormControl 
            fullWidth 
            error={!!errors.location?.city}
            disabled={!selectedState}
          >
            <FormLabel>City</FormLabel>
            <Select
              {...register("location.city")}
              value={selectedCity}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCity(value);
                setValue('location.city', value);
              }}
              error={!!errors.location?.city}
            >
              <MenuItem value="" disabled>Select City</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
            {errors.location?.city && (
              <FormHelperText error>{errors.location.city.message}</FormHelperText>
            )}
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
          <ImageUpload
            type="logo"
            preview={images.logo.preview}
            onUpload={(e) => handleImageUpload(e, 'logo')}
            onDelete={() => handleDeleteImage('logo')}
          />
          <ImageUpload
            type="background"
            preview={images.background.preview}
            onUpload={(e) => handleImageUpload(e, 'background')}
            onDelete={() => handleDeleteImage('background')}
          />
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
      <ImageCropDialog
        key={currentImage?.url}
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageUrl={currentImage?.url || ''}
        onCropComplete={handleCropComplete}
        aspectRatio={currentImage?.type === 'logo' ? 1 : 16 / 9}
      />
    </form >
  );
}
