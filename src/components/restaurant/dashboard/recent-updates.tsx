'use client';
import { Card, Typography, Box, IconButton } from "@mui/material";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import { getCardStyles } from "@/utils/styles/cardStyles";

interface Update {
  id: number;
  text: string;
  date: string;
  icon: React.ReactNode;
}

interface RecentUpdatesProps {
  updates: Update[];
}

export default function RecentUpdates({ updates }: RecentUpdatesProps) {
  const theme = useTheme();

  return (
    <Card
      className="lg:col-span-2"
      sx={{ ...getCardStyles(theme), p: 3 }}
    >
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        Recent Menu Updates
      </Typography>
      <div className="space-y-4">
        {updates.map((update) => (
          <Box
            key={update.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 1,
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.08)'
                }`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.07)'
                  : 'rgba(0, 0, 0, 0.04)',
                transform: 'translateX(4px)',
                borderColor: theme.palette.primary.main
              }
            }}
          >
            <IconButton
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {update.icon}
            </IconButton>
            <div className="flex-1">
              <Typography variant="body2">{update.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(update.date), 'MMM d, yyyy • h:mm a')}
              </Typography>
            </div>
          </Box>
        ))}
      </div>
    </Card>
  );
}
