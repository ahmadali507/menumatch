"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "@/components/theme/AppTheme";
import ColorModeSelect from "@/components/theme/ColorModeSelect";
import { GoogleIcon, SitemarkIcon } from "@/components/icons";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import { auth, db, provider } from "@/firebase/firebaseconfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
// import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { useRouter } from "next/navigation";
import { Alert, Snackbar } from "@mui/material";

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  display: "flex",
  flexDirection: "column",
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

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  borderRadius: "8px",
  "&.MuiAlert-standardSuccess": {
    backgroundColor: "#E7F6E7",
    color: "#1E4620",
    "& .MuiAlert-icon": {
      color: "#2E7D32",
    },
  },
  "&.MuiAlert-standardError": {
    backgroundColor: "#FDEDED",
    color: "#5F2120",
    "& .MuiAlert-icon": {
      color: "#D32F2F",
    },
  },
}));

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!response?.user) {
        throw new Error("Failed to create user");
      }

      await updateProfile(response.user, {
        displayName: data.name,
      });

      await addDoc(collection(db, "users"), {
        username: response.user.displayName,
        email: response.user.email,
        userId: response.user.uid,
        createdAt: serverTimestamp(),
      });

      setSnackbar({
        open: true,
        message: "Account created successfully!",
        severity: "success",
      });

      setTimeout(()=>{
        router.push("/auth/login");
      },1500)
    } catch (error: any) {
      let errorMessage = "An error occurred during sign up";

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Signup error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      provider.addScope("profile");
      provider.addScope("email");
      const result = await signInWithPopup(auth, provider);

      const userRef = collection(db, "users");
      const q = query(userRef, where("userId", "==", result.user.uid));
      const userDoc = await getDocs(q);

      if (userDoc.empty) {
        await addDoc(collection(db, "users"), {
          username: result.user.displayName || "Anonymous",
          email: result.user.email,
          userId: result.user.uid,
          createdAt: serverTimestamp(),
        });

        setSnackbar({
          open: true,
          message: "Account created successfully!",
          severity: "success",
        });
        setTimeout(()=>{
          router.push("/auth/login");
        },1500)
      }
    } catch (error: any) {
      let errorMessage = "Failed to sign in with Google";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in popup was closed";
          break;
        case "auth/popup-blocked":
          errorMessage = "Sign-in popup was blocked. Please allow popups";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with this email";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });

      console.error("Google Sign In Error:", {
        code: error.code,
        message: error.message,
        fullError: error,
      });
    }
  };
  ///////// google signin handler //////////

  // const handleGoogleSignIn = async () => {
  //   try {
  //     provider.addScope('profile');
  //     provider.addScope('email');
  //     const result = await signInWithPopup(auth, provider);
  //     const userRef = collection(db, "users");
  //     const q = query(userRef, where("userId", "==", result.user.uid));
  //     const userDoc = await getDocs(q);

  //     if (userDoc.empty) {
  //       await addDoc(collection(db, "users"), {
  //         username: result.user.displayName || "Anonymous",
  //         email: result.user.email,
  //         userId: result.user.uid,
  //         createdAt: serverTimestamp(),
  //       });
  //       console.log("New user added to Firestore");
  //       router.push("/auth/login")
  //     }
  //   } catch (error: any) {
  //     console.error("Detailed error:", {
  //       code: error.code,
  //       message: error.message,
  //       fullError: error
  //     });
  //   }
  // };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                {...register("name")}
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={!!errors.name}
                helperText={errors.name?.message}
                color={errors.name ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register("email")}
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
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
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                color={errors.password ? "error" : "primary"}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/auth/login" style={{ alignSelf: "center" }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", minWidth: "300px" }}
          elevation={6}
          variant="standard"
        >
          {snackbar.message}
        </StyledAlert>
      </Snackbar>
    </AppTheme>
  );
}
