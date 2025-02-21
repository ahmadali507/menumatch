import { getMenu, getRestaurantIdForAdmin } from "@/actions/actions.menu";
import { Card, Typography } from "@mui/material";
import MenuOverview from "@/components/restaurant/menus/menu-overview";
import MenuStats from "@/components/restaurant/menus/menu-stats";
import MenuSectionsList from "@/components/restaurant/menus/menu-sections-list";
import { MenuProvider } from "@/context/menuContext";

export const metadata = {
  title: "Menu Details",
  description: "View details of a menu"
}


export default async function SingleMenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const restaurantId = await getRestaurantIdForAdmin();
  if (!restaurantId) return null;

  const { success, menu } = await getMenu(restaurantId, menuId);


  if (!success || !menu) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Failed to fetch menu</Typography>
        <Typography color="text.secondary">An error occurred while loading the menu details</Typography>
      </Card>
    );
  }

  return (
    <MenuProvider initialMenu={menu}>
      <section className="space-y-6">
        <MenuOverview menu={menu} />
        <MenuStats menu={menu} />
        <MenuSectionsList restaurantId={restaurantId} sections={menu.sections} menuId={menu?.id} />
      </section>
    </MenuProvider>
  );
}