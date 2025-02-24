"use client";
import { Menu } from "@/types";
import {
  Card,
  CardHeader,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Avatar,
  Divider,
  styled
} from "@mui/material";
import { format, isAfter, isBefore, formatDistanceToNow } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RamadanIcon from '@mui/icons-material/Star';
import Link from "next/link";
import { routes } from "@/lib/routes";
import DeleteMenu from "./delete-menu";
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import LanguageIcon from '@mui/icons-material/Language';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
  height: '100%', // Make all cards same height
  display: 'flex',
  flexDirection: 'column',
}));

type MenuCardProps = {
  menu: Menu;
  onDelete?: (id: string) => void;
};

export default function MenuCard({ menu }: MenuCardProps) {
  const languageName = SUPPORTED_LANGUAGES.find(l => l.code === menu.language)?.name || menu.language;

  // Helper function to determine menu status
  const getMenuStatus = (menu: Menu): ({ status: string; statusText: string; color: 'success' | 'error' | 'warning' }) => {
    const now = new Date();

    switch (menu.availabilityType) {
      case 'indefinite':
        return {
          status: menu.status === 'active' ? 'active' : 'inactive',
          statusText: menu.status === 'active' ? 'Always Available' : 'Inactive',
          color: menu.status === 'active' ? 'success' : 'error'
        };

      case 'custom':
      case 'ramadan':
        if (!menu.startDate || !menu.endDate) {
          return {
            status: 'invalid',
            statusText: 'Invalid Dates',
            color: 'error'
          };
        }

        if (isBefore(now, menu.startDate as Date)) {
          return {
            status: 'upcoming',
            statusText: 'Upcoming',
            color: 'warning'
          };
        }

        if (isAfter(now, menu.endDate as Date)) {
          return {
            status: 'expired',
            statusText: 'Expired',
            color: 'error'
          };
        }

        return {
          status: 'active',
          statusText: 'Currently Active',
          color: 'success'
        };

      default:
        return {
          status: 'invalid',
          statusText: 'Invalid Type',
          color: 'error'
        };
    }
  };

  const menuStatus = getMenuStatus(menu);

  console.log("the manu cards", menu.id)
  return (
    <StyledCard>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <RestaurantMenuIcon />
          </Avatar>
        }
        title={
          <Link className="hover:underline" href={`${routes.menu}/${menu.id}`} passHref>
            <Typography variant="h6" component="h3" noWrap>
              {menu.name}
            </Typography>
          </Link>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href={`${routes.menu}/${menu.id}`} passHref>
              <IconButton size="small" color="primary" aria-label="edit menu">
                <EditIcon />
              </IconButton>
            </Link>
            <DeleteMenu menuId={menu?.id} />
          </Box>
        }
      />
     

      <Divider />

      <Stack spacing={2} sx={{ height: '100%', minHeight: '160px' }}> {/* Added minHeight */}
        <Stack spacing={1} sx={{ flex: 1 }}> {/* Added flex: 1 to take remaining space */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menu.availabilityType === "ramadan" &&
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RamadanIcon
                  color="success"
                  sx={{ fontSize: 20 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "lightgreen",
                    fontWeight: 500,
                    textTransform: 'uppercase'
                  }}
                >
                  Ramadan Menu
                </Typography>
              </Box>}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon
                color={menuStatus.color}
                sx={{ fontSize: 20 }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme => theme.palette[menuStatus.color].main,
                  fontWeight: 500,
                  textTransform: 'uppercase'
                }}
              >
                {menuStatus.statusText}
              </Typography>
            </Box>
          </Box>

          {menu.availabilityType !== 'indefinite' ? (
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                  Starts
                </Typography>
                <Typography variant="body2">
                  {format(menu.startDate as Date, 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                  Ends
                </Typography>
                <Typography variant="body2">
                  {format(menu.endDate as Date, 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Box>

              {menuStatus.status !== 'invalid' && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {menuStatus.status === 'active'
                    ? `Expires ${formatDistanceToNow(menu.endDate as Date, { addSuffix: true })}`
                    : menuStatus.status === 'upcoming'
                      ? `Starts ${formatDistanceToNow(menu.startDate as Date, { addSuffix: true })}`
                      : `Expired ${formatDistanceToNow(menu.endDate as Date, { addSuffix: true })}`
                  }
                </Typography>
              )}
            </Stack>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                This menu is always available to customers
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={menuStatus.statusText}
              color={menuStatus.color}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LayersIcon sx={{ fontSize: 16 }} color="action" />
            <Chip
              label={`${menu.sections.length} sections`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Stack>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <LanguageIcon fontSize="small" />
          <span>{languageName}</span>
        </div>
      </Stack>
    </StyledCard>
  );
}