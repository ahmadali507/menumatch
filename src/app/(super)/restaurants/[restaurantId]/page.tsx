import SectionLayout from "@/components/layouts/section-layout";
import RestaurantDetails from "@/components/restaurant-details";
import { RestaurantDetailsType } from "@/types";

const dummyData: RestaurantDetailsType = {
  id: 1,
  name: "Italian Delight",
  location: "New York",
  status: "active",
  cuisine: "Italian",
  orders: 450,
  admins: [
    { name: "John Doe", role: "Head Admin" },
    { name: "Jane Smith", role: "Menu Manager" },
    { name: "Mike Johnson", role: "Staff Admin" },
  ],
  menus: [
    {
      id: "1",
      name: "Lunch Special",
      startDate: "2024-03-01T11:00:00Z",
      endDate: "2024-12-31T15:00:00Z",
      sections: [
        {
          name: "Appetizers",
          items: [
            {
              name: "Bruschetta",
              description: "Grilled bread with tomatoes, garlic and basil",
              ingredients: ["bread", "tomatoes", "garlic", "basil", "olive oil"],
              photo: "https://example.com/bruschetta.jpg",
              price: 8.99,
              allergens: ["gluten"],
              available: true,
              labels: ["vegetarian"]
            },
            {
              name: "Caprese Salad",
              description: "Fresh mozzarella, tomatoes, and sweet basil",
              ingredients: ["mozzarella", "tomatoes", "basil", "balsamic"],
              photo: "https://example.com/caprese.jpg",
              price: 10.99,
              allergens: ["dairy"],
              available: true,
              labels: ["vegetarian", "gluten-free"]
            }
          ]
        },
        {
          name: "Main Courses",
          items: [
            {
              name: "Spaghetti Carbonara",
              description: "Classic carbonara with pancetta and egg",
              ingredients: ["pasta", "eggs", "pancetta", "pecorino"],
              photo: "https://example.com/carbonara.jpg",
              price: 16.99,
              allergens: ["gluten", "dairy", "eggs"],
              available: true,
              labels: []
            }
          ]
        }
      ]
    },
    {
      id: "2",
      name: "Dinner Menu",
      startDate: "2024-03-01T17:00:00Z",
      endDate: "2024-12-31T23:00:00Z",
      sections: [
        {
          name: "Starters",
          items: [
            {
              name: "Calamari Fritti",
              description: "Crispy fried calamari with marinara sauce",
              ingredients: ["calamari", "flour", "marinara sauce"],
              photo: "https://example.com/calamari.jpg",
              price: 12.99,
              allergens: ["gluten", "shellfish"],
              available: true,
              labels: []
            }
          ]
        },
        {
          name: "Pasta",
          items: [
            {
              name: "Fettuccine Alfredo",
              description: "Creamy alfredo sauce with parmesan",
              ingredients: ["pasta", "cream", "parmesan"],
              photo: "https://example.com/alfredo.jpg",
              price: 18.99,
              allergens: ["gluten", "dairy"],
              available: true,
              labels: ["vegetarian"]
            }
          ]
        },
        {
          name: "Desserts",
          items: [
            {
              name: "Tiramisu",
              description: "Classic Italian dessert",
              ingredients: ["coffee", "mascarpone", "ladyfingers"],
              photo: "https://example.com/tiramisu.jpg",
              price: 8.99,
              allergens: ["gluten", "dairy", "eggs"],
              available: true,
              labels: ["vegetarian"]
            }
          ]
        }
      ]
    },
    {
      id: "3",
      name: "Weekend Brunch",
      startDate: "2024-01-01T09:00:00Z",
      endDate: "2024-02-29T14:00:00Z", // Inactive menu
      sections: [
        {
          name: "Breakfast Favorites",
          items: [
            {
              name: "Italian Breakfast Bowl",
              description: "Eggs, prosciutto, and roasted vegetables",
              ingredients: ["eggs", "prosciutto", "vegetables"],
              photo: "https://example.com/breakfast.jpg",
              price: 14.99,
              allergens: ["eggs"],
              available: true,
              labels: ["gluten-free"]
            }
          ]
        }
      ]
    }
  ]
};


export default async function RestaurantDetailsPage({ params }: { params: Promise<{ restaurantId: string }> }) {

  const { restaurantId } = await params;

  return (
    <SectionLayout
      title="Restaurant Details"
      description="Displays detailed information about a specific restaurant"
    >
      <RestaurantDetails restaurantId={restaurantId} details={dummyData} />
    </SectionLayout>
  );
}