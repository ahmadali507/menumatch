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

import { format } from "date-fns";
import AddItemToMenu from "./actions/add-item-menu";
import DeleteMenu from "./delete-menu";
import EditableSectionName from "./actions/editable";
import MenuItemCard from "./menu-item";

const dummyMenuSection: MenuSectionType = {
  "createdAt": new Date(),
  name: "Appetizers",
  items: [
    {
      name: "Vegetable Spring Rolls",
      description: "Crispy rolls filled with fresh vegetables and served with sweet chili sauce",
      price: 8.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1544025162-d76694265947",
      available: true,
      labels: ["Vegetarian", "Crispy", "Asian"],
      allergens: ["Gluten", "Soy"]
    },
    {
      name: "Crispy Calamari",
      description: "Lightly breaded calamari rings served with marinara sauce",
      price: 12.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
      available: true,
      labels: ["Seafood", "Crispy"],
      allergens: ["Shellfish", "Gluten"]
    },
    {
      name: "Classic Bruschetta",
      description: "Toasted bread topped with diced tomatoes, garlic, and fresh basil",
      price: 7.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f",
      available: false,
      labels: ["Vegetarian", "Italian"],
      allergens: ["Gluten"]
    }
  ]
};

export default function MenuSection({ section }: { section: MenuSectionType }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSectionNameUpdate = (newName: string) => {
    console.log('Section name updated:', newName);
    // Add your update logic here
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card sx={{ pt: 3, px: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div className="flex gap-4 items-center">
            <EditableSectionName
              name={dummyMenuSection.name}
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
          {section.items.length > 0 ? (
            <Grid container spacing={3}>
              {section.items.map((item, index) => (
                <MenuItemCard item={item} key={item.name + index} />
              ))}
            </Grid>
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