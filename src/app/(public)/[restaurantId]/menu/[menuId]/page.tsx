import { getMenu } from "@/actions/actions.menu";
import { getRestaurantData } from "@/actions/actions.admin";
import PublicMenuView from "@/components/public/menu/public-menu-view";
// import { dummyMenu, dummyRestaurant } from "@/lib/dummy";

export default async function PublicMenuPage({ params }: { params: Promise<{ restaurantId: string, menuId: string }> }) {
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
    <div>
      {menuData.menu.status === "inactive" && <InactiveMenu />}
      <PublicMenuView menu={menuData.menu} restaurant={restaurantData} />
    </div>
  );
}

function InactiveMenu() {
  return <div className="w-full p-4 flex justify-center">
    <div className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-800">
      This menu is currently Inactive
    </div>
  </div>
}