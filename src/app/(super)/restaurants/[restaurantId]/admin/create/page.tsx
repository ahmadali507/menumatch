"use client";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SectionLayout from '@/components/layouts/section-layout';

const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function CreateAdminPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema)
  });

  const onSubmit = async (data: AdminFormData) => {
    console.log(data);
    // Handle form submission
    alert("admin created, now go to restaurant id page");
  };

  return (
    <SectionLayout title='Create Admin' description='Creates a Restaurant Admin account for a specific restaurant.'>

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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Create Admin Account
        </Button>
      </form>
    </SectionLayout>
  );
}