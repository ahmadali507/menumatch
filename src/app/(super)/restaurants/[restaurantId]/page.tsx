import { getRestaurantData } from "@/actions/actions.admin";
import { getRestaurantMenus } from "@/actions/actions.menu";
import SectionLayout from "@/components/layouts/section-layout";
import RestaurantInformation from "@/components/restaurant/info/restaurant-content";
import { Menu } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Restaurant Details",
  description: "View and manage detailed information about the restaurant",
};

export default async function RestaurantDetailsPage({ params }: {
  params: Promise<{ restaurantId: string }>
}){
  const { restaurantId } = await params;
  const restaurantData = await getRestaurantData(restaurantId);
  if (!restaurantData) return notFound();

  // Remove dummy data assignment
  restaurantData.status = "active";
  restaurantData.orders = 450;

  const response = await getRestaurantMenus(restaurantId);
  if (response.success && response.menus) {
    // Ensure menus are properly formatted with timestamps
    restaurantData.menus = response.menus.map(menu => ({
      ...menu,
      createdAt: menu.createdAt ? new Date(menu.createdAt) : null,
      updatedAt: menu.updatedAt ? new Date(menu.updatedAt) : null,
      sections: menu.sections?.map(section => ({
        ...section,
        createdAt: section.createdAt ? new Date(section.createdAt) : null,
        items: section.items?.map(item => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : null,
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
        }))
      }))
    })) as Menu[];
  }

  return (
    <SectionLayout
      title="Restaurant Details"
      description="Displays detailed information about a specific restaurant"
    >
      <RestaurantInformation restaurantId={restaurantId} details={restaurantData} />
    </SectionLayout>
  );
}