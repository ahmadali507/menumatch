import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/languages';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTheme } from '@mui/material/styles';

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 2 
      }}>
        <TranslateIcon sx={{ color: 'primary.main' }} />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 500,
            color: 'text.primary' 
          }}
        >
          Menu Language
        </Typography>
      </Box>
      <FormControl 
        fullWidth 
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: isDarkMode ? 'grey.990' : 'grey.100',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            }
          },
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, -12px) scale(0.75)', // Move label up
            backgroundColor: theme.palette.background.paper, // Label background
            padding: '0 8px', // Padding around label
            '&.Mui-focused': {
              color: 'primary.main'
            }
          },
          '& .MuiMenuItem-root': {
            '&:hover': {
              backgroundColor: isDarkMode ? 'grey.900' : 'grey.200' // Darker hover state
            }
          }
        }}
      >
        <InputLabel 
          sx={{ 
            color: 'text.secondary',
            '&.Mui-focused': {
              color: 'primary.main'
            }
          }}
        >
          Select Language
        </InputLabel>
        <Select
          value={value}
          label="Select Language"
          onChange={(e) => onChange(e.target.value as LanguageCode)}
          disabled={disabled}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: isDarkMode ? 'grey.800' : 'grey.100', // Darker menu background
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'grey.700' : 'grey.200' // Darker hover state for menu items
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDarkMode ? 'primary.dark' : 'primary.lighter',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'primary.darker' : 'primary.light'
                    }
                  }
                }
              }
            }
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <MenuItem 
              key={lang.code} 
              value={lang.code}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'grey.700' : 'primary.lighter'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{lang.name}</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: isDarkMode ? 'grey.400' : 'text.secondary' }}
                >
                  ({lang.code.toUpperCase()})
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}