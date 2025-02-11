"use client";
import { Box, Typography, Grid } from "@mui/material";
import MenuSection from "@/components/restaurant/menus/menu-section";
import { MenuSection as MenuSectionType } from "@/types";
import EmptyState from "@/components/ui/empty-state";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddSection from './add-section';

export default function MenuSectionsList({ sections, menuId }: { sections: MenuSectionType[], menuId: string }) {

  return (
    <Box className="space-y-4">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Menu Sections</Typography>
        <AddSection menuId={menuId} />
      </Box>

      {!sections.length ? (
        <EmptyState
          icon={<RestaurantMenuIcon sx={{ fontSize: 48 }} />}
          title="No Sections Yet"
          description="This menu doesn't have any sections. Add sections to organize your menu items."
        />
      ) : (
        <Grid container spacing={3}>
          {sections.map((section, index) => (
            <Grid item xs={12} key={index}>
              <MenuSection section={section} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
