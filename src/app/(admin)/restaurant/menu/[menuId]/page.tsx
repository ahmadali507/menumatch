import { getMenu, getRestaurantIdForAdmin } from "@/actions/actions.menu";
import { Card, Typography } from "@mui/material";
import { unstable_cache } from "next/cache";
import MenuOverview from "@/components/restaurant/menus/menu-overview";
import MenuStats from "@/components/restaurant/menus/menu-stats";
import MenuSectionsList from "@/components/restaurant/menus/menu-sections-list";

export const metadata = {
  title: "Menu Details",
  description: "View details of a menu"
}

const getCachedMenu = unstable_cache(getMenu);

export default async function SingleMenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const restaurantId = await getRestaurantIdForAdmin();
  const { success, menu } = await getCachedMenu(restaurantId, menuId);

  if (!success || !menu) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Failed to fetch menu</Typography>
        <Typography color="text.secondary">An error occurred while loading the menu details</Typography>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <MenuOverview menu={menu} />
      <MenuStats menu={menu} />
      <MenuSectionsList sections={menu.sections} menuId={menuId} />
    </section>
  );
}