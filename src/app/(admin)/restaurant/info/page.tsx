import { getRestaurantData } from "@/actions/actions.admin";
import { getRestaurantIdForAdmin } from "@/actions/actions.menu";
import PageTitle from "@/components/restaurant/dashboard/page-title";

export const metadata = {
  title: "Restaurant Information",
  description: "View all information about your restaurant"
}

export default async function RestaurantInformationPage() {

  const restaurantId = await getRestaurantIdForAdmin();
  const restaurant = await getRestaurantData(restaurantId);

  return <section className="pb-6">
    <PageTitle title="Restaurant Information" description="View all information about your restaurant" />
    <pre>{JSON.stringify(restaurant, null, 2)}</pre>
  </section>
}