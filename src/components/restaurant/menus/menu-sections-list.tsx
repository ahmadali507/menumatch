"use client";
import { Box, Typography, Grid } from "@mui/material";
import MenuSection from "@/components/restaurant/menus/menu-section";
import { MenuSection as MenuSectionType } from "@/types";
import EmptyState from "@/components/ui/empty-state";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddSection from './add-section';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useMenu } from "@/context/menuContext";

export default function MenuSectionsList({ sections: initialSections, menuId }: { sections: MenuSectionType[], menuId: string }) {
  const { data: sections = initialSections } = useQuery({
    queryKey: queryKeys.menuSections(menuId),
    initialData: initialSections,
  });

  const {menu} = useMenu(); 

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // TODO: Implement optimistic update for reordering
      // Will be handled in a separate implementation
    }
  };

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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sections.map(section => section.name)}>
            <Grid container spacing={3}>
              {menu?.sections.map((section, index) => (
                <Grid item xs={12} key={section.name + index}>
                  <MenuSection menuId={menuId} section={section} />
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      )}
    </Box>
  );
}