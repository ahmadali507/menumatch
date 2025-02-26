import { getMenu, getRestaurantIdForAdmin } from "@/actions/actions.menu";
import { Card, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import MenuOverview from "@/components/restaurant/menus/menu-overview";
import MenuStats from "@/components/restaurant/menus/menu-stats";
import MenuSectionsList from "@/components/restaurant/menus/menu-sections-list";
import { MenuProvider } from "@/context/menuContext";
import { unstable_cache } from "next/cache";
import AddPromotionalContent from "@/components/restaurant/menus/add-promotional-content";

export const metadata = {
  title: "Menu Details",
  description: "View details of a menu"
}

export default async function SingleMenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const restaurantId = await getRestaurantIdForAdmin();
  if (!restaurantId) return null;

  const { success, menu } = await unstable_cache(getMenu)(restaurantId, menuId);

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
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <MenuOverview menu={menu} />
          </div>
          <Link href={`/${restaurantId}/menu/${menuId}`} target="_blank">
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon fontSize="small" />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                ml: 2,
                height: '32px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }
              }}
            >
              Preview
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <MenuStats menu={menu} />
          <AddPromotionalContent menuId={menu?.id} initialContent={menu?.promoContent} />
        </div>
        <MenuSectionsList restaurantId={restaurantId} sections={menu.sections} menuId={menu?.id} />
      </section>
    </MenuProvider>
  );
}