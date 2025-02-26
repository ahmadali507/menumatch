'use client';

import { FormControl, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' }
];

export default function LanguageSelector({
  currentLanguage,
  restaurantId
}: {
  currentLanguage: string;
  restaurantId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLang: string) => {
    startTransition(() => {
      router.push(`/${restaurantId}?lang=${newLang}`);
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small">
        <Select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          sx={{ minWidth: 120 }}
          disabled={isPending}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isPending && <CircularProgress size={20} />}
    </Box>
  );
}
