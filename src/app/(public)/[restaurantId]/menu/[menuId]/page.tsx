import { getMenu } from "@/actions/actions.menu";
import { getRestaurantData } from "@/actions/actions.admin";
import PublicMenuView from "@/components/public/menu/public-menu-view";
// import { dummyMenu, dummyRestaurant } from "@/lib/dummy";

export default async function PublicMenuPage({ params }: { params: { restaurantId: string, menuId: string } }) {
  const restaurantId = (await params).restaurantId;
  const menuId = (await params).menuId;

  const [menuData, restaurantData] = await Promise.all([
    getMenu(restaurantId, menuId),
    getRestaurantData(restaurantId)
  ]);

  if (!menuData.success || !menuData.menu || !restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Menu not found</p>
      </div>
    );
  }

  return (
    <PublicMenuView menu={menuData.menu} restaurant={restaurantData} />
  );
}