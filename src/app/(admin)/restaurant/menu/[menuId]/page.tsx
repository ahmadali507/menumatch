import { getMenu, getRestaurantIdForAdmin } from "@/actions/actions.menu"
import PageTitle from "@/components/restaurant/dashboard/page-title";

export default async function SingleMenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;

  const restaurantId = await getRestaurantIdForAdmin();

  const { success, menu } = await getMenu(restaurantId, menuId);

  if (!success || !menu) {
    return <div>Failed to fetch menu. An error occured</div>
  }

  return <section>
    <PageTitle title={menu.name} description={`Check details for ${menu.name}`} />

    <pre>{JSON.stringify(menu, null, 2)}</pre>
  </section>
}