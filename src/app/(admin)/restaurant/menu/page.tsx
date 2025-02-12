import { routes } from "@/lib/routes";
import { Button, Typography } from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/Add';
import MenuCard from "@/components/restaurant/menus/menu-card";

export const metadata: Metadata = {
  title: "Menus",
  description: "View and Manage all menus from here",
}

import Link from "next/link";
import { Metadata } from "next";
import PageTitle from "@/components/restaurant/dashboard/page-title";
import { getUser } from "@/actions/actions.cookies";
import { redirect } from "next/navigation";
import { getRestaurantMenus } from "@/actions/actions.menu";

export default async function RestaurantMenuPage() {

  const user = await getUser();
  if (!user) {
    redirect(routes.login);
  }

  const { success, menus } = await getRestaurantMenus(user?.restaurantId as string);

  console.log(menus);

  if (!success) {
    return <div>Failed to fetch menus. An error occured</div>
  }

  return <section className="pb-6 space-y-6">
    <PageTitle title="Manage Menus" description="Manage and Edit all your menus here">
      <Link href={routes.addMenu}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<RestaurantMenuIcon />}
        >
          Add Menu
        </Button>
      </Link>
    </PageTitle>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {menus?.map((menu) => (
        <MenuCard key={menu.id} menu={menu} />
      ))}
      {menus?.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No menus found. Create your first menu by clicking the Add Menu button.
        </Typography>
      )}
    </div>
  </section>
}