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
import Link from "next/link";
import { routes } from "@/lib/routes";
import DeleteMenu from "./delete-menu";

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
  // Add date status helper
  const getDateStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    if (isBefore(now, startDate)) return "upcoming";
    if (isAfter(now, endDate)) return "expired";
    return "active";
  };

  const dateStatus = getDateStatus(new Date(menu.startDate), new Date(menu.endDate));
  // decide status based on dates
  const active = isAfter(new Date(), new Date(menu.startDate)) && isBefore(new Date(), new Date(menu.endDate));

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
            <DeleteMenu menuId={menu.id} />
          </Box>
        }
      />

      <Divider />

      <Stack spacing={2}>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon
              color={dateStatus === 'active' ? 'success' : 'action'}
              sx={{ fontSize: 20 }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme =>
                  dateStatus === 'active' ? theme.palette.success.main :
                    dateStatus === 'expired' ? theme.palette.error.main :
                      theme.palette.warning.main,
                fontWeight: 500,
                textTransform: 'uppercase'
              }}
            >
              {dateStatus === 'active' ? 'Currently Active' :
                dateStatus === 'expired' ? 'Expired' : 'Upcoming'}
            </Typography>
          </Box>

          <Stack spacing={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                Starts
              </Typography>
              <Typography variant="body2">
                {format(new Date(menu.startDate), 'EEEE, MMMM d, yyyy')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                Ends
              </Typography>
              <Typography variant="body2">
                {format(new Date(menu.endDate), 'EEEE, MMMM d, yyyy')}
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {dateStatus === 'active'
                ? `Expires ${formatDistanceToNow(new Date(menu.endDate), { addSuffix: true })}`
                : dateStatus === 'upcoming'
                  ? `Starts ${formatDistanceToNow(new Date(menu.startDate), { addSuffix: true })}`
                  : `Expired ${formatDistanceToNow(new Date(menu.endDate), { addSuffix: true })}`
              }
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 'auto' }} // Push to bottom
        >
          <Chip
            label={active ? 'Active' : 'Inactive'}
            color={active ? 'success' : 'error'}
            size="small"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LayersIcon sx={{ fontSize: 16 }} color="action" />
            <Chip
              label={`${menu.sections.length} sections`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Stack>
      </Stack>
    </StyledCard>
  );
}