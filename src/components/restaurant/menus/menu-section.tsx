"use client";
import { MenuSection as MenuSectionType } from "@/types";
import {
  Card,
  Typography,
  Grid,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { format } from "date-fns";
import AddItemToMenu from "./actions/add-item-menu";
// import DeleteMenu from "./delete-menu";
import EditableSectionName from "./actions/editable";
import MenuItemCard from "./menu-item";
import DeleteSectionItem from "./deleteSectionItem";
import { reorderItems, updateMenuSectionName } from "@/actions/actions.menu";
import { useMenu } from "@/context/menuContext";
// import { dummyMenuSection } from "@/lib/dummy";

interface MenuSectionProps {
  menuId: string;
  section: MenuSectionType;
  selectedLabels: string[];
}

export default function MenuSection({ menuId, section, selectedLabels }: MenuSectionProps) {
  const [, setItems] = useState(section.items);
  const [isExpanded, setIsExpanded] = useState(false);

  const { menu, setMenu } = useMenu();
  const {
    attributes,
    listeners,
    setNodeRef,

    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id as string });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSectionNameUpdate = async (newName: string) => {

    console.log('Section name updated:', newName);
    return await updateMenuSectionName(menuId, section.id, newName);
    // Add your update logic here
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const items = [...section.items];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        console.log(reorderedItems);
        // Update local state
        setItems(reorderedItems);

        // Update menu context
        if (menu) {


          const updatedMenu = {
            ...menu,
            sections: menu.sections.map(s =>
              s.id === section.id
                ? { ...s, items: reorderedItems }
                : s
            )
          };
          setMenu(updatedMenu);
          const response = await reorderItems(menuId, section.id, reorderedItems);
          if (!response.success) {
            console.error("Failed to reorder items", response.error);
            return;
          }
          console.log("Reordering the menuItems");

          console.log("successfullyy reordered items. ")

        }
      }
    }

  };

  const filteredItems = useMemo(() => {
    if (!selectedLabels.length) return section.items;

    return section.items.filter(item =>
      selectedLabels.some(label => item.labels?.includes(label))
    );
  }, [section.items, selectedLabels]);

  if (selectedLabels.length > 0 && filteredItems.length === 0) {
    return null;
  }

  return (
    <Card sx={{ pt: 3, px: 3 }} ref={setNodeRef} style={style}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Mobile-first responsive layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between'
          }}
        >
          {/* Section name and metadata */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center gap-4">
              <DragIndicatorIcon
                {...attributes}
                {...listeners}
                sx={{
                  cursor: 'grab',
                  color: 'text.secondary',
                  opacity: 0.5,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.1)',
                  }
                }}
              />
              <EditableSectionName
                sectionId={section.id}
                name={section.name}
                onSave={handleSectionNameUpdate}
              />
            </div>

            {/* Stats and metadata */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mt: { xs: 1, sm: 0 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FastfoodIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {section.items.length} items
                </Typography>
              </Box>
              {section.createdAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(section?.createdAt as Date), "MMM d, yyyy")}
                  </Typography>
                </Box>
              )}
            </Box>
          </div>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-end', sm: 'flex-start' }
            }}
          >
            <DeleteSectionItem menuId={menuId} sectionId={section?.id} />
            <AddItemToMenu menuId={menuId} sectionId={section?.id} />
            <IconButton
              onClick={handleToggle}
              size="small"
              sx={{ ml: 1 }}
            >
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded} timeout="auto">
          {filteredItems.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={filteredItems.map(item => item.id as string)}>
                <Grid container spacing={3}>
                  {filteredItems.map((item, index) => (
                    <MenuItemCard
                      menuId={menuId}
                      sectionId={section.id}
                      key={item.name + index}
                      item={item}
                    />
                  ))}
                </Grid>
              </SortableContext>
            </DndContext>
          ) : (
            <EmptyState />
          )}
        </Collapse>
      </Box>
    </Card>
  );
}

function EmptyState() {
  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 2,
      gap: 2,
      borderRadius: 1,
    }}
  >
    <RestaurantMenuIcon
      sx={{
        fontSize: 64,
        color: 'grey.300'
      }}
    />
    <Typography variant="h6" color="text.secondary">
      No items in this section yet
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      Click the &quot;Add Item&quot; button above to add your first menu item
    </Typography>
  </Box>
}