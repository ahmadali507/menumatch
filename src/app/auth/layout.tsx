import AppTheme from "@/components/theme/AppTheme";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return <AppTheme>{children}</AppTheme>
}