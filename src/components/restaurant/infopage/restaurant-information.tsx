import {
  Button, Card, Typography,
  Divider,
  Grid
} from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from "next/link";
import { Menu, RestaurantType } from "@/types";
import RestaurantHeader from "../restaurant-header";
import RestaurantStats from "../restaurant-stats";
// import MenuList from "../menu-list";
import AdminsList from "../admins-list";
import { getRestaurantMenus } from "@/actions/actions.menu";
import MenuCard from "../menus/menu-card";
import { Suspense } from 'react';
import RestaurantInfoLoader from "./infopage-loader";
// import { dateTimePickerTabsClasses } from "@mui/x-date-pickers";
//   import RestaurantHeader from "./restaurant/restaurant-header";
//   import MenuList from "./restaurant/menu-list";
//   import AdminsList from "./restaurant/admins-st";
//   import RestaurantStats from "./restaurant/restaurant-stats";

export default async function RestaurantInformation({ restaurantId, details }: { restaurantId: string; details: RestaurantType }) {
  return (
    <Suspense fallback={<RestaurantInfoLoader />}>
      <RestaurantContent restaurantId={restaurantId} details={details} />
    </Suspense>
  );
}

async function RestaurantContent({ restaurantId, details }: { restaurantId: string; details: RestaurantType }) {
  const response = await getRestaurantMenus(restaurantId);
  if (response.success) {
    details.menus = response?.menus as Menu[];
  }
  if (!response.success) {
    console.log("Error fetching menus");
  }

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
          {/* TODO : INSTEAD OF MENU LIST USE THE MENU CARD WITH MAPPING OF THE MENUS */}

          {/* <MenuList restaurantId={restaurantId} menus={details.menus} /> */}
          <Grid container spacing={3}>
            {details?.menus?.map((menu) => (
              <Grid item xs={12} sm={6} key={menu.id}>
                <MenuCard menu={menu} />
              </Grid>
            ))}
          </Grid>
        </div>
      </Card>

      <AdminsList restaurantId={restaurantId} admins={details.admins} />
    </div>
  );
}