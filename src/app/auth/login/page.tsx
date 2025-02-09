"use client";
import * as React from "react";
// import { Alert, Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "@/components/theme/AppTheme";
import { GoogleIcon } from "@/components/icons";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "@/firebase/firebaseconfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { setUserCookie } from "@/actions/actions.cookies";
import LoadingButton from '@/components/ui/loading-button';  // Add this import
// import { CustomSnackbar } from "@/components/ui/custom-toaster";
import { useToast } from "@/context/toastContext";
import ColorModeSelect from "@/components/theme/ColorModeSelect";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  remember: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "600px", // Change from '450px' to '600px' or your desired width
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

// const StyledAlert = styled(Alert)(() => ({
//   borderRadius: "8px",
//   "&.MuiAlert-standardSuccess": {
//     backgroundColor: "#E7F6E7",
//     color: "#1E4620",
//     "& .MuiAlert-icon": {
//       color: "#2E7D32",
//     },
//   },
//   "&.MuiAlert-standardError": {
//     backgroundColor: "#FDEDED",
//     color: "#5F2120",
//     "& .MuiAlert-icon": {
//       color: "#D32F2F",
//     },
//   },
// }));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  // const [snackbar, setSnackbar] = React.useState({
  //   open: false,
  //   message: "",
  //   severity: "success" as "success" | "error",
  // });

  const {showToast} = useToast(); 
  const [, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  // const handleCloseSnackbar = () => {
  //   setSnackbar({ ...snackbar, open: false });
  // };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userDocs = await getDocs(
        query(collection(db, "users"), where("userId", "==", result.user.uid))
      );

      if (userDocs.empty) {
        await result.user.delete();
        // setSnackbar({
        //   open: true,
        //   message: "User not registered. Please sign up first",
        //   severity: "error",
        // });
        showToast("User not registered. Please sign up first", "error");
        router.push("/auth/signup");
        return;
      }

      // setSnackbar({
      //   open: true,
      //   message: "Successfully signed in!",
      //   severity: "success",
      // });
      showToast("Successfully signed in!", "success");
      router.push("/");
    } catch (error) {
      // setSnackbar({
      //   open: true,
      //   message: "Error signing in with Google",
      //   severity: "error",
      // });
      showToast("Error signing in with Google", "error");
      console.error("Error signing in with google: ", error);
    }
  };

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!response?.user) {
        // setSnackbar({
        //   open: true,
        //   message: "Failed to sign in",
        //   severity: "error",
        // });
        showToast("Failed to sign in", "error");
        return;

      }

      console.log("User Signed IN", response?.user); 

      await setUserCookie(response?.user?.uid); 

      const userDocRef = doc(db, "users", response.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc) {
        // setSnackbar({
        //   open: true,
        //   message: "User account not found",
        //   severity: "error",
        // });
        showToast("User account not found", "error");
        return;
      }

      showToast("User Logged in successfully", "success");


      setTimeout(() => {
        router.push("/");
      }, 1000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = "Failed to sign in";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Invalid password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Try again later";
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
      setIsLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register("email")}
                id="email"
                // type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                color={errors.email ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                {...register("password")}
                type="password"
                id="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                color={errors.password ? "error" : "primary"}
              />
            </FormControl>
            {/* <FormControlLabel
              control={
                <Checkbox
                  {...register("remember")}
                  color="primary"
                />
              }
              label="Remember me"
            /> */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              isLoading={isLoading}
              loadingText="Signing In"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Link
              href="/auth/forgot-password"
              // component="button"
              type="button"
              onClick={() => setOpen(true)}
              // variant="body2"
              style={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button> */}
            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" style={{ alignSelf: "center" }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      > */}
        {/* <StyledAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", minWidth: "300px" }}
          elevation={6}
          variant="standard"
        >
          {snackbar.message}
        </StyledAlert> */}
      {/* <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      /> */}
      {/* </Snackbar> */}
    </AppTheme>
  );
}
