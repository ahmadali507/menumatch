import { Button, CircularProgress, type ButtonProps } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function LoadingButton({ 
  isLoading, 
  loadingText = 'Loading...', 
  children, 
  ...props 
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={isLoading}
      sx={{
        // height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        '&.Mui-disabled': {
          color: 'gray',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        },
        ...props.sx
      }}
    >
      {isLoading ? (
        <>
          {loadingText}
          <CircularProgress size={20} sx={{ color: 'inherit' }} />
        </>
      ) : (
        children
      )}
    </Button>
  );
}