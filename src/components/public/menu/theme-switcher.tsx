"use client";
import { IconButton, Tooltip, useColorScheme, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeSwitcher() {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  const toggleColorMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  return (
    <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        sx={{
          position: 'fixed',
          right: 20,
          top: 20,
          zIndex: 1100,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            opacity: 0.9
          }
        }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
