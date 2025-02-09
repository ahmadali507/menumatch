'use client'
import { Box, Card, Typography, useTheme } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Link from "next/link";

type ActivityItem = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  timestamp: string;
};

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const theme = useTheme();

  const defaultActivities: ActivityItem[] = [
    {
      id: 1,
      title: "New Restaurant Added",
      description: "Italian Cuisine",
      icon: <RestaurantIcon />,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "New Restaurant Added",
      description: "Italian Cuisine",
      icon: <RestaurantIcon />,
      timestamp: "2 hours ago"
    },
    {
      id: 3,
      title: "New Restaurant Added",
      description: "Italian Cuisine",
      icon: <RestaurantIcon />,
      timestamp: "2 hours ago"
    },
  ];

  const itemsToShow = activities || defaultActivities;

  return (
    <Card sx={{ gridColumn: 'span 2', p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Activity
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {itemsToShow.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: theme.palette.background.paper,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer'
              }
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <RestaurantIcon
                sx={{
                  color: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.54)'
                }}
              />
            </Box>
            <Box>
              <Link href="#" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                    '&:hover': {
                      color: theme.palette.primary.light,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {activity.title}
                </Typography>
              </Link>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  opacity: theme.palette.mode === 'dark' ? 0.7 : 0.6
                }}
              >
                {activity.description} • {activity.timestamp}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
