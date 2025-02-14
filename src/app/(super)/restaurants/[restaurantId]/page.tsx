import { getRestaurantData } from "@/actions/actions.admin";
import SectionLayout from "@/components/layouts/section-layout";
// import RestaurantDetails from "@/components/restaurant-details";
import RestaurantInformation from "@/components/restaurant/info/restaurant-information";
import { dummyMenus } from "@/lib/dummy";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Restaurant Details",
  description: "View and manage detailed information about the restaurant",
};

export default async function RestaurantDetailsPage({ params }: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params;

  const restaurantData = await getRestaurantData(restaurantId);
  if (!restaurantData) return notFound();

  // setting some dummy values for now
  restaurantData.menus = dummyMenus;
  restaurantData.status = "active";
  restaurantData.orders = 450;

  return (
    <SectionLayout
      title="Restaurant Details"
      description="Displays detailed information about a specific restaurant"
    >
      <RestaurantInformation restaurantId={restaurantId} details={restaurantData} />
    </SectionLayout>
  );
}