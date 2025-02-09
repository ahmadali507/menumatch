import { fetchAllRestaurants } from "@/actions/actions.admin";
import RestaurantsTable from "@/components/tables/restaurants-table";
import { RestaurantType } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "View and manage all restaurants from here",
}

export default async function RestaurantsPage() {
  const response = await fetchAllRestaurants();

  // Provide fallback empty array if restaurants is undefined
  const restaurants = response.success ? response.restaurants?.map((elm) => {
    return {
      id: elm.id,
      name: elm.name,
      location: elm.location,
      status: "active",
      cuisine: "Italian",
      orders: 69,
      contact: elm.contact,
      admins: [],
      menus: []
    } satisfies RestaurantType
  }) || [] : [];

  console.log("First restaurant:", restaurants[0]);

  return <RestaurantsTable restaurants={restaurants} />;
}