import { MenuItem } from "@/types";
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
  Divider,
  Badge,
  Tooltip
} from "@mui/material";
import Image from "next/image";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningIcon from '@mui/icons-material/Warning';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
      >
        <Box sx={{ position: 'relative', height: 200 }}>
          <Image
            src={item.photo}
            alt={item.name}
            fill
            style={{ objectFit: 'cover' }}
          />
          <Badge
            sx={{
              position: 'absolute',
              top: 12,
              right: 40,
            }}
            badgeContent={
              item.available ? (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Available"
                  size="small"
                  color="success"
                />
              ) : (
                <Chip
                  icon={<CancelIcon />}
                  label="Unavailable"
                  size="small"
                  color="error"
                />
              )
            }
          />
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h6" component="h3" fontWeight="bold">
                {item.name}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                fontWeight="bold"
                sx={{ whiteSpace: 'nowrap' }}
              >
                ${item.price.toFixed(2)}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>

            <Divider sx={{ my: 2 }} />


            <Stack pt={2} direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Box display="flex" gap={1}>
                <RestaurantIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Ingredients:
                </Typography>
              </Box>
              {item.ingredients.map((ingredient) => (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              ))}
            </Stack>


            {item.labels.length > 0 && (
              <Stack direction="row" pt={1} spacing={1} flexWrap="wrap" useFlexGap>
                <Box display="flex" gap={1}>
                  <LocalDiningIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Labels:
                  </Typography>
                </Box>
                {item.labels.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}

            {item.allergens.length > 0 && (
              <Stack pt={1} direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Box display="flex" gap={1}>
                  <WarningIcon color="error" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Allergens:
                  </Typography>
                </Box>
                {item.allergens.map((allergen) => (
                  <Tooltip title={`Contains ${allergen}`} key={allergen}>
                    <Chip
                      label={allergen}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Tooltip>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      </Card>
    </Grid>
  );
}