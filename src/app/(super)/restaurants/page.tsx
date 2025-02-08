import { fetchAllRestaurants } from "@/actions/actions.admin";
import RestaurantsTable from "@/components/tables/restaurants-table";
import { RestaurantType } from "@/types";


// const dummyRestaurants: RestaurantType[] = Array.from({ length: 20 }, (_, i) => ({
//   restaurantId: `${i + 1}` as string,
//   // name: `Restaurant ${i + 1}`,
//   restaurantName: `Restaurant ${i + 1}`,
//   location: { 
//     city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'][Math.floor(Math.random() * 5)],
//     state: 'Some State',
//     address: '123 Main St',
//     country: 'USA'
//   },
//   status: Math.random() > 0.2 ? 'active' : 'inactive',
//   cuisine: ['Italian', 'Japanese', 'Mexican', 'American', 'Indian'][Math.floor(Math.random() * 5)],
//   orders: Math.floor(Math.random() * 500) + 50,
//   contact: {email : `contact${i + 1}@restaurant.com` as string, phone : `123-456-${i + 1}` as string}, 
// }));


export default async function RestaurantsPage() {
  const response = await fetchAllRestaurants();
  
  // Provide fallback empty array if restaurants is undefined
  const restaurants = response.success ? response.restaurants?.map((elm) => {
    return {
      restaurantId: elm.id,
      name: elm.name,
      location: elm.location,
      status: "active",
      cuisine: "Italian",
      orders: 69,
      contact: elm.contact,
    } satisfies RestaurantType
  }) || [] : [];
  
  console.log("First restaurant:", restaurants[0]);

  return <RestaurantsTable restaurants={restaurants} />;
}