import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Restore access to your account"
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}