"use client";
import { Menu } from "@/types";
import {
  Card,
  CardHeader,
  Typography,
  Box,
  Avatar,
  Stack,
  styled
} from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RamadanIcon from '@mui/icons-material/Star';
import Link from "next/link";

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

type PublicMenuCardProps = {
  menu: Menu;
  restaurantId: string;
};

export default function PublicMenuCard({ menu, restaurantId }: PublicMenuCardProps) {
  const getMenuStatus = (menu: Menu) => {
    const now = new Date();

    switch (menu.availabilityType) {
      case 'indefinite':
        return {
          status: 'active',
          statusText: 'Available',
          color: 'success'
        };

      case 'custom':
      case 'ramadan':
        if (!menu.startDate || !menu.endDate) return { status: 'invalid', statusText: 'Unavailable', color: 'error' };
        if (isBefore(now, menu.startDate)) return { status: 'upcoming', statusText: 'Coming Soon', color: 'warning' };
        if (isAfter(now, menu.endDate)) return { status: 'expired', statusText: 'Unavailable', color: 'error' };
        return { status: 'active', statusText: 'Available', color: 'success' };

      default:
        return { status: 'invalid', statusText: 'Unavailable', color: 'error' };
    }
  };

  const menuStatus = getMenuStatus(menu);

  return (
    <Link href={`/${restaurantId}/menu/${menu.id}`} passHref style={{ textDecoration: 'none' }}>
      <StyledCard>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <RestaurantMenuIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6" component="h3">
              {menu.name}
            </Typography>
          }
        />

        <Stack spacing={2} sx={{ p: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menu.availabilityType === "ramadan" && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RamadanIcon color="success" sx={{ fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: "lightgreen" }}>
                  Ramadan Menu
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon color={menuStatus.color as any} sx={{ fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: theme => theme.palette[menuStatus.color as any].main }}>
                {menuStatus.statusText}
              </Typography>
            </Box>
          </Box>

          {menu.availabilityType !== 'indefinite' && menu.startDate && menu.endDate && (
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Available from
                </Typography>
                <Typography variant="body2">
                  {format(menu.startDate, 'MMM d')} - {format(menu.endDate, 'MMM d, yyyy')}
                </Typography>
              </Box>
            </Stack>
          )}

        </Stack>
      </StyledCard>
    </Link>
  );
}
