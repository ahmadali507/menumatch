'use client';
import { Card, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getCardStyles } from "@/lib/utils/styles/cardStyles";

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{ ...getCardStyles(theme), p: 3 }}
    >
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        Quick Actions
      </Typography>
      <div className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outlined"
            color={action.color as "success"}
            startIcon={action.icon}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              p: 1.5,
              textAlign: 'left',
              borderColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.12)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? `${action.color}.900`
                  : `${action.color}.50`,
                borderColor: theme.palette.mode === 'dark'
                  ? `${action.color}.500`
                  : `${action.color}.200`,
              }
            }}
          >
            {action.title}
          </Button>
        ))}
      </div>
    </Card>
  );
}
