"use client";
import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  CssVarsThemeOptions,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: CssVarsThemeOptions["components"];
}

export default function AppTheme({ children }: AppThemeProps) {
  return (
    <CssVarsProvider defaultMode="system"> {/* ✅ Ensure defaultMode is set */}
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </CssVarsProvider>
  );
}

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { mode = "system" } = useColorScheme(); // ✅ Ensure mode is never undefined
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // ✅ Ensure mode is always defined
  const resolvedMode = React.useMemo(() => {
    if (mode === "system") {
      return prefersDarkMode ? "dark" : "light";
    }
    return mode || "light"; // Default to light if undefined
  }, [mode, prefersDarkMode]);

  console.log("User Mode:", mode, "| Applied Theme Mode:", resolvedMode);

  const theme = React.useMemo(() => {
    const themeOptions = {
      light: {
        primary: {
          main: "#1976d2",
          light: "#42a5f5",
          dark: "#1565c0",
        },
        secondary: {
          main: "#9c27b0",
          light: "#ba68c8",
          dark: "#7b1fa2",
        },
        background: {
          default: "#ffffff",
          paper: "#f5f5f5",
        },
        text: {
          primary: "rgba(0, 0, 0, 0.87)",
          secondary: "rgba(0, 0, 0, 0.6)",
        },
        action: {
          active: "rgba(0, 0, 0, 0.54)",
          hover: "rgba(0, 0, 0, 0.04)",
          selected: "rgba(0, 0, 0, 0.08)",
          disabled: "rgba(0, 0, 0, 0.26)",
          disabledBackground: "rgba(0, 0, 0, 0.12)",
        },
      },
      dark: {
        primary: {
          main: "#90caf9",
          light: "#e3f2fd",
          dark: "#42a5f5",
        },
        secondary: {
          main: "#ce93d8",
          light: "#f3e5f5",
          dark: "#ab47bc",
        },
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
        text: {
          primary: "#ffffff",
          secondary: "rgba(255, 255, 255, 0.7)",
        },
        action: {
          active: "#fff",
          hover: "rgba(255, 255, 255, 0.08)",
          selected: "rgba(255, 255, 255, 0.16)",
          disabled: "rgba(255, 255, 255, 0.3)",
          disabledBackground: "rgba(255, 255, 255, 0.12)",
        },
      },
    };

    return createTheme({
      palette: {
        mode: resolvedMode,
        ...themeOptions[resolvedMode],
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: themeOptions[resolvedMode].background.default,
              color: themeOptions[resolvedMode].text.primary,
              transition: "all 0.3s ease",
            },
          },
        },
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
      },
      colorSchemes,
      typography,
      shadows,
      shape,
    });
  }, [resolvedMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
