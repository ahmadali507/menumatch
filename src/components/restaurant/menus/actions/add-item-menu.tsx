'use client'
import { Button, } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { useParams } from "next/navigation";

export default function AddItemToMenu({ menuId, sectionId }: { menuId: string, sectionId: string }) {
  const {user} = useUser(); 
  const {restaurantId} = useParams();
  return <Link href= {(user?.role === "super_admin") ? `/restaurants/${restaurantId}/menu/${menuId}/additem/${sectionId}`  : `/restaurant/menu/${menuId}/additem/${sectionId}`}>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      size="small"
      sx={{ ml: 2, maxWidth: "200px" }}
    >
      Add Item
    </Button>
  </Link>

}