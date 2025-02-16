import { Button, } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link";

export default function AddItemToMenu({ menuId, sectionId }: { menuId: string, sectionId: string }) {
  return <Link href={`/restaurant/menu/${menuId}/additem/${sectionId}`}>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      size="small"
      sx={{ ml: 2 }}
    >
      Add Item
    </Button>
  </Link>

}