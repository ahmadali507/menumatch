import SignInForm from "@/components/forms/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your account",
}

export default function LoginPage() {
  return <SignInForm />
}