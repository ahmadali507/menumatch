"use client";
import { Button, Card, Typography, Chip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { blue, green, purple, amber } from '@mui/material/colors';
import Link from "next/link";
import { Menu } from "@/types";

export default function MenuList({ restaurantId, menus }: {
  restaurantId: string;
  menus: Menu[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {menus?.map((menu) => (
        <Card
          key={menu.id}
          className="p-4 hover:shadow-xl transition-all duration-200"
          sx={{
            borderLeft: '4px solid',
            borderLeftColor: menu.endDate && menu.startDate && new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate)
              ? green[400]
              : amber[700],
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <Typography variant="h6" sx={{ color: '#fff' }}>{menu.name}</Typography>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-gray-300">
                  <RestaurantMenuIcon sx={{ fontSize: 18, color: purple[300] }} />
                  <Typography variant="caption" sx={{ color: 'inherit' }}>
                    {menu.sections.length} Sections
                  </Typography>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <RestaurantIcon sx={{ fontSize: 18, color: blue[300] }} />
                  <Typography variant="caption" sx={{ color: 'inherit' }}>
                    {menu.sections.reduce((acc, section) => acc + section.items.length, 0)} Items
                  </Typography>
                </div>
              </div>
            </div>
            {menu.endDate && menu.startDate && <Chip
              size="small"
              label={new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate) ? 'Active' : 'Inactive'}
              color={new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate) ? 'success' : 'error'}
              sx={{
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }
              }}
            />}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              size="small"
              variant="outlined"
              component={Link}
              href={`/restaurants/${restaurantId}/menu/${menu.id}`}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              View Details
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<EditIcon />}
              component={Link}
              href={`/restaurants/${restaurantId}/menu/${menu.id}/edit`}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                border: "none",
                ":hover": {
                  backgroundColor: "lightblue",
                  transition: "none"
                }
              }}
            >
              Edit Menu
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
