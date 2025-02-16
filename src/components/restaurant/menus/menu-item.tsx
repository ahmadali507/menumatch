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
  Tooltip,
  IconButton,
  Box as MuiBox
} from "@mui/material";
import Image from "next/image";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningIcon from '@mui/icons-material/Warning';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSectionItem from './deleteSectionItem';
import { useState } from 'react';
import EditItemDialog from './edit-item-dialogue';

interface MenuItemCardProps {
  item: MenuItem;
  dragHandleProps?: {
    icon: React.ReactNode;
    [key: string]: unknown;
  };
}

export default function MenuItemCard({ item, menuId, sectionId }: MenuItemCardProps & { menuId: string; sectionId: string }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id as string });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4} ref={setNodeRef} style={style}>
        <Card
          variant="outlined"
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => theme.shadows[4],
              '& .action-buttons': {
                opacity: 1
              }
            }
          }}
        >
          <Box sx={{ position: 'relative', height: 200 }}>
            <Box
              {...attributes}
              {...listeners}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 2,
                cursor: 'grab',
                opacity: 0,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)',
                },
                '.MuiCard-root:hover &': {
                  opacity: 0.8
                }
              }}
            >
              <DragIndicatorIcon
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: 24,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  p: 0.5,
                }}
              />
            </Box>
            <MuiBox
              className="action-buttons"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                display: 'flex',
                gap: 1,
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: 1,
                padding: '4px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { 
                    color: 'primary.main',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onClick={() => setEditDialogOpen(true)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <DeleteSectionItem
                menuId={menuId}
                sectionId={sectionId}
                itemId={item.id}
              />
            </MuiBox>
            <Image
              src={item?.photo as string || "/400/placeholder/svg"}
              alt={item.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
              unoptimized
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%)',
                zIndex: 1
              }}
            />
            <Badge
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 44,
                zIndex: 2, 
                alignSelf : 'center'
              }}
              badgeContent={
                item.available ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Available"
                    size="small"
                    color="success"
                    sx={{ backdropFilter: 'blur(4px)' }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Unavailable"
                    size="small"
                    color="error"
                    sx={{ backdropFilter: 'blur(4px)' }}
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
                {item.description.replace(/<[^>]*>/g, '')}
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

      <EditItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={item}
        menuId={menuId}
        sectionId={sectionId}
      />
    </>
  );
}