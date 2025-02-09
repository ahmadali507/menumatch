"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/firebase/firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { SignInContainer } from "@/components/forms/sign-in-form";
import LoadingButton from "@/components/ui/loading-button";
import { useToast } from "@/context/toastContext";

const forgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const router = useRouter();
  // const [snackbar, setSnackbar] = React.useState({
  //   open: false,
  //   message: "",
  //   severity: "success" as "success" | "error",
  // });
  // const [email, setEmail] = React.useState("");

  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: ForgetPasswordFormData) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      // setSnackbar({
      //   open: true,
      //   message: "Password reset email sent! Please check your inbox",
      //   severity: "success",
      // });
      showToast("Password reset email sent!. Please check your inbox", "success");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = "Failed to send reset email";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }
      // setSnackbar({
      //   open: true,
      //   message: errorMessage,
      //   severity: "error",
      // });
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "400px",
            margin: "auto",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Typography>

          <TextField
            {...register("email")}
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <LoadingButton
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            loading={loading}
            sx={{ mt: 2 }}
          >
            Send Reset Link
          </LoadingButton>

          <Button
            onClick={() => router.push("/auth/login")}
            variant="text"
            fullWidth
          >
            Back to Login
          </Button>
        </Box>
      </SignInContainer>

      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar> */}
    </>
  );
}