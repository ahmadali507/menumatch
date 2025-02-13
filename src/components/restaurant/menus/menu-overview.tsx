import { Box, Stack, Typography, Chip } from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Menu } from "@/types";
import MenuQRCode from "./menu-qrcode";
import MenuExport from "./menu-export";

export default function MenuOverview({ menu }: { menu: Menu }) {
  const isActive = new Date(menu.startDate) <= new Date() && new Date(menu.endDate) >= new Date();
  const totalItems = menu.sections.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{
          bgcolor: 'primary.main',
          borderRadius: 2,
          p: 1,
          display: 'flex'
        }}>
          <RestaurantMenuIcon sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <div>
          <Typography variant="h5" fontWeight="medium">{menu.name}</Typography>
          <Stack direction="row" spacing={3} mt={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {menu.sections.length} sections
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FastfoodIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {totalItems} items
              </Typography>
              <Chip
                label={isActive ? "Active" : "Inactive"}
                color={isActive ? "success" : "default"}
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Stack>
        </div>
      </Stack>

      <div className="flex gap-2 items-center">
        <MenuQRCode
          menuId={menu.id}
          qrCode={menu.qrCode}
        />
        <MenuExport menu={menu} />
      </div>

    </Box>
  );
}
