import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MenuItem } from "@/types";
import { Grid } from "@mui/material";
import MenuItemCard from "./menu-item";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface Props {
  item: MenuItem;
}

export default function DraggableMenuItemCard({ item }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Grid item xs={12} sm={6} md={4} ref={setNodeRef} style={style}>
      <MenuItemCard
        item={item}
        dragHandleProps={{
          ...attributes,
          ...listeners,
          icon: <DragIndicatorIcon
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'white',
              cursor: 'grab',
              fontSize: 20,
              opacity: 0.7,
              '&:hover': {
                opacity: 1
              }
            }} />
        }} menuId={""} sectionId={""}      />
    </Grid>
  );
}