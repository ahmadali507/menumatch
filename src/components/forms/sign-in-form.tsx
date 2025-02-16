"use client";


import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { setUserCookie } from "@/actions/actions.cookies";
import LoadingButton from '@/components/ui/loading-button';  // Add this import
import { useToast } from "@/context/toastContext";
import { UserData } from "@/types";
import { defaultRoutes } from "@/lib/routes";
import { useUser } from "@/context/userContext";
// import { createSuperAdmin } from "@/actions/actions.admin";

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

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const { showToast } = useToast();
  const { setUser } = useUser();
  const [, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();


  // React.useEffect(()=>{
  //     const createS_Admin =async () =>{
  //     const response =   await createSuperAdmin({
  //         email : "ahmad@gmail.com", 
  //         password : "AhmadAli", 
  //         name : "Ahmad Ali",
  //         role : "super-admin"
  //       }); 
  //       console.log(response?.data);
  //     }
  //      createS_Admin(); 
  // }, []); 

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const userDocs = await getDocs(
  //       query(collection(db, "users"), where("userId", "==", result.user.uid))
  //     );

  //     if (userDocs.empty) {
  //       await result.user.delete();
  //       showToast("User not registered. Please sign up first", "error");
  //       router.push("/auth/signup");
  //       return;
  //     }

  //     showToast("Successfully signed in!", "success");
  //     router.push("/");
  //   } catch (error) {
  //     showToast("Error signing in with Google", "error");
  //     console.error("Error signing in with google: ", error);
  //   }
  // };

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!response?.user) {
        showToast("Failed to sign in", "error");
        return;
      }

      await setUserCookie(response?.user?.uid as string);

      const userDocRef = doc(db, "users", response.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc) {
        showToast("User account not found", "error");
        return;
      }

      showToast("User Logged in successfully", "success");

      const userRole = (userDoc.data() as UserData).role
      setUser(userDoc.data() as UserData);
      console.log("Redirecting to default route based on the role");

      setTimeout(() => {
        router.push(defaultRoutes[userRole] || "/")
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

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
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
          {/* <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>

          </Box> */}
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
          elevation={6}-li
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
    </>
  );
}
