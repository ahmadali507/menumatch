"use client";
import { useState, useMemo } from 'react';
import { Box, Typography, Grid } from "@mui/material";
import MenuSection from "@/components/restaurant/menus/menu-section";
import { MenuSection as MenuSectionType } from "@/types";
import EmptyState from "@/components/ui/empty-state";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddSection from './add-section';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useMenu } from "@/context/menuContext";
import { reorderSections } from "@/actions/actions.menu";
import { useToast } from "@/context/toastContext";
import LabelSearch from "./label-search";
import SaveVersion from './save-version';
import SwitchVersion from './switch-version';


export default function MenuSectionsList({ menuId, restaurantId }: { sections: MenuSectionType[], menuId: string, restaurantId: string }) {

  const { menu, setMenu } = useMenu();
  console.log(menu, "menu"); 
  const { showToast } = useToast();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Get all unique labels from all sections
  const allLabels = useMemo(() => {
    if (!menu?.sections) return [];
    const labelsSet = new Set<string>();
    menu.sections.forEach(section => {
      section.items?.forEach(item => {
        item.labels?.forEach(label => labelsSet.add(label));
      });
    });
    return Array.from(labelsSet);
  }, [menu?.sections]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active || active.id === over.id) return;

    try {
      const oldIndex = menu?.sections.findIndex((section) => section.id === active.id);
      const newIndex = menu?.sections.findIndex((section) => section.id === over.id);

      if (oldIndex === -1 || newIndex === -1 || !menu?.sections) return;

      const reorderedSections = arrayMove(menu.sections, oldIndex as number, newIndex as number);

      setMenu({
        ...menu,
        sections: reorderedSections
      });
      const response = await reorderSections(restaurantId as string || null, menuId, reorderedSections);
      if (!response.success) {
        setMenu({
          ...menu,
          sections: menu.sections
        });
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error reordering sections:', error);
      showToast('Failed to reorder sections', 'error');
      // You might want to show an error toast here
    }
  };

  return (
    <Box className="space-y-4">
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        mb: 3
      }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mb: { xs: 1, sm: 0 }
          }}
        >
          Menu Sections
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <SaveVersion menuId={menuId} restaurantId={restaurantId} />
          <SwitchVersion menuId={menuId} restaurantId={restaurantId} />
          <AddSection menuId={menuId} restaurantId = {restaurantId} />
        </Box>
      </Box>

      {/* Add Label Search */}
      <Box sx={{ mb: 3 }}>
        <LabelSearch
          onLabelChange={setSelectedLabels}
          allLabels={allLabels}
          selectedLabels={selectedLabels}
        />
      </Box>

      {menu?.sections.length === 0 ? (
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
          <SortableContext items={menu?.sections?.map(section => section.id) || []}>
            <Grid container spacing={3}>
              {menu?.sections.map((section, index) => (
                <Grid item xs={12} key={section.name + index}>
                  <MenuSection
                    menuId={menuId}
                    section={section}
                    selectedLabels={selectedLabels}
                  />
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      )}
    </Box>
  );
}