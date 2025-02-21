import { Paper, Typography, Grid } from '@mui/material';
import { MenuSection } from '@/types';
import MenuItemCard from "./public-menu-item"

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

  if (filteredItems.length === 0) return null;

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
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <MenuItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}