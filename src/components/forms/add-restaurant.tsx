"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import {
  Typography, TextField, Button, FormControl,
  FormLabel, FormHelperText, Paper
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
  }),
  contact: z.object({
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Valid email required"),
  })
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;
export default function AddRestaurantForm() {
  const router = useRouter();
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema)
  });

  const onSubmit = async (data: RestaurantFormData) => {
    // Handle form submission
    console.log(data, logo, background);
    router.push('/restaurants/123'); // Replace 123 with actual ID
  };
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            onClick={() => document.getElementById('logo-upload')?.click()}
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
            onClick={() => document.getElementById('background-upload')?.click()}
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

    <Button
      type="submit"
      variant="contained"
      size="large"
      className="mt-8"
      fullWidth
    >
      Create Restaurant
    </Button>
  </form>
}