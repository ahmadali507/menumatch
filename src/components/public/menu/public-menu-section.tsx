import { Paper, Typography, Grid, Box } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { MenuSection } from '@/types';
import MenuItemCard from "./public-menu-item"

function NoItemsSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        py: 4,
        opacity: 0.7
      }}
    >
      <FastfoodIcon
        sx={{
          fontSize: '3rem',
          color: 'text.secondary',
          opacity: 0.5
        }}
      />
      <Typography
        variant="subtitle1"
        color="text.secondary"
        align="center"
      >
        No items available in this section
      </Typography>
    </Box>
  );
}

export default function PublicMenuSection({
  section,
  selectedLabels
}: {
  section: MenuSection,
  selectedLabels: string[]
}) {
  const filteredItems = section.items.filter(item => {
    if (selectedLabels.length === 0) return true;
    return item.labels?.some(label => selectedLabels.includes(label));
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: 600,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            backgroundColor: 'primary.main',
            borderRadius: 1
          }
        }}
      >
        {section.name}
      </Typography>
      {filteredItems.length > 0 ? (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <MenuItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoItemsSection />
      )}
    </Paper>
  );
}