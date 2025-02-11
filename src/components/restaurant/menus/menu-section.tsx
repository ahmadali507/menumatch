import { MenuSection as MenuSectionType } from "@/types";
import {
  Card,
  Typography,
  Grid,
  Box,
  Stack,
  Chip
} from "@mui/material";
import FastfoodIcon from '@mui/icons-material/Fastfood';

import Image from "next/image";

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
      labels: ["Vegetarian", "Crispy"],
      allergens: ["Gluten"]
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
  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <div className="flex gap-4">

          <Typography variant="h4">
            {dummyMenuSection.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FastfoodIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {section.items.length} items
            </Typography>
          </Box>
        </div>
        <Grid container spacing={3}>
          {dummyMenuSection.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined">
                <Box sx={{ position: 'relative', height: 200 }}>
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {!item.available && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography color="white" variant="subtitle1">
                        Currently Unavailable
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                      ${item.price.toFixed(2)}
                    </Typography>
                    {(item.labels.length > 0 || item.allergens.length > 0) && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {item.labels.map((label) => (
                          <Chip
                            key={label}
                            label={label}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                        {item.allergens.map((allergen) => (
                          <Chip
                            key={allergen}
                            label={allergen}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card >
  );
}