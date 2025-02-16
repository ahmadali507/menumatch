"use client";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link";
import { useUser } from "@/context/userContext";

export default function AddAdminButtonLink({ restaurantId }: { restaurantId?: string }) {

  const { user } = useUser();

  if (user?.role !== "super_admin") return null;

  return <Button
    variant="contained"
    size="small"
    startIcon={<AddIcon />}
    component={Link}
    href={`/restaurants/${restaurantId!}/admin/create`}
  >
    Add Admin
  </Button>
}