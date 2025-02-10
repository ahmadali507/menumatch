import { Theme } from '@mui/material/styles';

export const getCardStyles = (theme: Theme) => ({
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.12)'
    : '1px solid rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s ease',
});
