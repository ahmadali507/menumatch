import { Button, Card, Typography, Divider, Grid } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Link from "next/link";
import { RestaurantType } from "@/types";
import RestaurantHeader from "../restaurant-header";
import RestaurantStats from "../restaurant-stats";
import AdminsList from "../admins-list";
import MenuCard from "../menus/menu-card";


export default async function RestaurantContent({
  restaurantId,
  details,
}: {
  restaurantId: string;
  details: RestaurantType;
}) {


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
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Current Menus
          </Typography>
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
