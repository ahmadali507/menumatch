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
import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { format } from "date-fns";
import AddItemToMenu from "./actions/add-item-menu";
import DeleteMenu from "./delete-menu";
import EditableSectionName from "./actions/editable";
import MenuItemCard from "./menu-item";

export default function MenuSection({ section }: { section: MenuSectionType }) {
  const [items, setItems] = useState(section.items);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSectionNameUpdate = (newName: string) => {
    console.log('Section name updated:', newName);
    // Add your update logic here
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id);
        const newIndex = items.findIndex((item) => item.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card sx={{ pt: 3, px: 3 }} ref={setNodeRef} style={style}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div className="flex gap-4 items-center">
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
              name={section.name}
              onSave={handleSectionNameUpdate}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FastfoodIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {section.items.length} items
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(section.createdAt), "EEEE, MMMM d, yyyy")}
              </Typography>
            </Box>
          </div>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <DeleteMenu menuId="dummy-for-now" />
            <AddItemToMenu />
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
          {items.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map(item => item.name)}>
                <Grid container spacing={3}>
                  {items.map((item, index) => (
                    <MenuItemCard
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