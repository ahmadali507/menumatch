import {
  Button, Card, Typography,
  Divider
} from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from "next/link";
import { RestaurantType } from "@/types";
import RestaurantHeader from "./restaurant/restaurant-header";
import MenuList from "./restaurant/menu-list";
import AdminsList from "./restaurant/admins-list";
import RestaurantStats from "./restaurant/restaurant-stats";

export default function RestaurantDetails({ restaurantId, details }: { restaurantId: string; details: RestaurantType }) {
  return (
    <div className="flex gap-6 w-full">
      <Card style={{ flexGrow: 2 }}>
        <RestaurantHeader restaurantId={restaurantId} details={details} />
        <RestaurantStats details={details} />

        <Divider className="my-6" />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Menu Management</Typography>
            <Button
              variant="contained"
              startIcon={<MenuBookIcon />}
              component={Link}
              href={`/restaurants/${restaurantId}/menu`}
            >
              Manage Menus
            </Button>
          </div>
          <Typography color="text.secondary">
            Create and manage restaurant menus, categories, and items
          </Typography>
        </div>

        <div className="mt-6 pt-4">
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>Current Menus</Typography>
          <MenuList restaurantId={restaurantId} menus={details.menus} />
        </div>
      </Card>

      <AdminsList restaurantId={restaurantId} admins={details.admins} />
    </div>
  );
}