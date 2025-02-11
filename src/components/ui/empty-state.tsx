import { Box, Typography, Button, SxProps } from "@mui/material";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  sx?: SxProps;
}

export default function EmptyState({ icon, title, description, action, sx }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        ...sx
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
        {description}
      </Typography>
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
