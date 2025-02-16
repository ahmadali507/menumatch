"use client";
import { Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Link from "next/link";
import { useUser } from "@/context/userContext";


export default function ManageMenusButtonLink() {

  const { user } = useUser();
  if (user?.role !== "admin") return null;

  return <Button
    variant="contained"
    startIcon={<MenuBookIcon />}
    component={Link}
    href="/restaurant/menu"
  >
    Manage Menus
  </Button>
}