
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppTheme from "@/components/theme/AppTheme";
import { UserContextProvider } from "@/context/userContext";
import QueryProvider from "@/components/query-provider";
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from "@/context/toastContext";
import { CssBaseline } from "@mui/material";
import LocalizationProviderClient from "@/components/localization-provider";




const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    "template": "%s | MenuManage",
    default: "MenuManage",
  },
  description: "A comprehensive SaaS solution that enables restaurants to easily manage their menus digitally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico " sizes="any" />
      <body className={`${inter.className} antialiased`}>
        <NextTopLoader showSpinner={false} />
        <ToastProvider>
          <LocalizationProviderClient>

            <UserContextProvider>
              <QueryProvider>
                <CssBaseline />
                <AppTheme>{children}</AppTheme>
              </QueryProvider>
            </UserContextProvider>
          </LocalizationProviderClient>

        </ToastProvider>
      </body>
    </html>
  );
}
