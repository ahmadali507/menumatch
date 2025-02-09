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
  // CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createRestaurant } from "@/actions/actions.admin";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/ui/loading-button";
import { useToast } from "@/context/toastContext";
import { addRestaurantSchema, TAddRestaurantSchema } from "@/lib/schema";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/firebase/firebaseconfig";
// import { dataDisplayCustomizations } from "../theme/customizations/dataDisplay";


export default function AddRestaurantForm() {
  const router = useRouter();
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);

  const { showToast } = useToast();
  /// creating a mutation using reactQuery.....

  const mutation = useMutation({
    mutationFn: (data: TAddRestaurantSchema) => {
      return createRestaurant(data);
    },
    onSuccess: (response) => {
      console.log("Response from createRestaurant", response);
      if (response.success) {
        showToast("Restaurant created successfully", "success")
        setTimeout(() => {
          router.push(`/restaurants/${response.restaurantId}`);
        }, 1000)
      }
    },
    onError: (error) => {
      //TODO: inroduce toasts to handle errors in an efficient way....
      showToast("Error creating restaurant", "error")
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
        <FormControl fullWidth error={!!errors.name}>
          <FormLabel>Restaurant Name</FormLabel>
          <TextField
            {...register("name")}
            placeholder="e.g. The Italian Place"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </FormControl>
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
          <FormControl fullWidth error={!!errors.location?.city}>
            <FormLabel>City</FormLabel>
            <TextField
              {...register("location.city")}
              error={!!errors.location?.city}
              helperText={errors.location?.city?.message}
            />
          </FormControl>
          <FormControl fullWidth error={!!errors.location?.state}>
            <FormLabel>State</FormLabel>
            <TextField
              {...register("location.state")}
              error={!!errors.location?.state}
              helperText={errors.location?.state?.message}
            />
          </FormControl>
          <FormControl fullWidth error={!!errors.location?.country}>
            <FormLabel>Country</FormLabel>
            <TextField
              {...register("location.country")}
              error={!!errors.location?.country}
              helperText={errors.location?.country?.message}
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
