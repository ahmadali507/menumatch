"use client";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TextField,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Alert
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SectionLayout from '@/components/layouts/section-layout';
import { useMutation } from "@tanstack/react-query";
import { addRestaurantAdmin } from "@/actions/actions.admin";
import { useParams, useRouter } from 'next/navigation';
import LoadingButton from '@/components/ui/loading-button';
import { useToast } from '@/context/toastContext';

const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  , confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function CreateAdminForm() {
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema)
  });

  const { mutate: createAdmin, isPending, isError, error } = useMutation({
    mutationFn: (data: AdminFormData) => addRestaurantAdmin({
      ...data,
      role: 'admin',
      restaurantId: params.restaurantId as string
    }),
    onSuccess: (response) => {
      if (response.success) {
        showToast("Admin created successfully", 'success')
        setTimeout(() => {
          router.push(`/restaurants/${params.restaurantId}`);
        }, 1000);
      } else {
        showToast(response.error || 'Failed to create admin', 'error')
      }
    },
    onError: (error) => {
      showToast("Error creating admin", 'error')
      console.error('Failed to create admin:', error);
    }
  });

  const onSubmit = async (data: AdminFormData) => {
    createAdmin(data);
  };

  return (
    <SectionLayout title='Create Admin' description='Creates a Restaurant Admin account for a specific restaurant.'>


      {isError && (
        <Alert severity="error" className="mb-4">
          {error instanceof Error ? error.message : 'Failed to create admin'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormControl fullWidth error={!!errors.name}>
          <FormLabel>Full Name</FormLabel>
          <TextField
            {...register("name")}
            placeholder="John Doe"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <TextField
            {...register("email")}
            type="email"
            placeholder="admin@restaurant.com"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <TextField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ border: "none" }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <TextField
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                    sx={{ border: "none" }}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          isLoading={isPending}
        >
          {isPending ? 'Creating Admin...' : 'Create Admin Account'}
        </LoadingButton>
      </form>
    </SectionLayout>
  );
}