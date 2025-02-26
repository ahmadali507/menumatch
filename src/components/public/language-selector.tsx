'use client';

import { FormControl, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';

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

  const handleLanguageChange = (newLang: string) => {
    router.push(`/${restaurantId}?lang=${newLang}`);
  };

  return (
    <FormControl size="small">
      <Select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        sx={{ minWidth: 120 }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
