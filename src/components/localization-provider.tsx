"use client";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PropsWithChildren } from "react";

export default function LocalizationProviderClient({ children }: PropsWithChildren) {
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    {children}
  </LocalizationProvider>
}
