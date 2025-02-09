"use client";
import { AvatarGroup, Card, Avatar, Typography, Box, useTheme } from "@mui/material";

export default function RestaurantAdmins() {
  const theme = useTheme();

  return (
    <Box>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Restaurant Admins
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}>
          <AvatarGroup max={3}>
            <Avatar sx={{ fontSize: 20 }}>MA</Avatar>
            <Avatar sx={{ fontSize: 20 }}>JD</Avatar>
            <Avatar sx={{ fontSize: 20 }}>RK</Avatar>
            <Avatar sx={{ fontSize: 20 }}>SK</Avatar>
          </AvatarGroup>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {["Mike Anderson", "John Doe", "Rachel Kim"].map((name) => (
            <Box
              key={name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
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
                  width: 40,
                  height: 40,
                  fontSize: 20
                }}
              >
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{name}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}