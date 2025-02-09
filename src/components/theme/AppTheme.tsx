"use client";
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, themeComponents } = props;
  const theme = createTheme({
    palette: {
      mode: 'dark', // Set dark mode as default
    },
    colorSchemes,
    typography,
    shadows,
    shape,
    components: {
      ...inputsCustomizations,
      ...dataDisplayCustomizations,
      ...feedbackCustomizations,
      ...navigationCustomizations,
      ...surfacesCustomizations,
      ...themeComponents,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}