"use client";
import { Card, Avatar, Typography, Box, useTheme } from "@mui/material";

type Admin = {
  id: string;
  name: string;
  email: string;
};

export default function RestaurantAdmins({ admins }: { admins: Admin[] }) {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{
        p: { xs: 2, sm: 3 },
        height: '100%'
      }}>
        <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 } }}>
          Restaurant Admins
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.5, sm: 1 },
          maxHeight: '300px', // Set a maximum height
          overflowY: 'auto',  // Enable vertical scrolling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(0, 0, 0, 0.3)',
          }
        }}>
          {admins.map((admin) => (
            <Box
              key={admin.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                p: { xs: 1, sm: 1.5 },
                borderRadius: 1,
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer'
                }
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  fontSize: { xs: 16, sm: 20 }
                }}
              >
                {admin.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{admin.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {admin.email}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}