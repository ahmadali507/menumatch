export const dummyMenus = [
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

export const dummyMenuSection = {
  "createdAt": new Date(),
  name: "Appetizers",
  items: [
    {
      name: "Vegetable Spring Rolls",
      description: "Crispy rolls filled with fresh vegetables and served with sweet chili sauce",
      price: 8.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1544025162-d76694265947",
      available: true,
      labels: ["Vegetarian", "Crispy", "Asian"],
      allergens: ["Gluten", "Soy"]
    },
    {
      name: "Crispy Calamari",
      description: "Lightly breaded calamari rings served with marinara sauce",
      price: 12.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
      available: true,
      labels: ["Seafood", "Crispy"],
      allergens: ["Shellfish", "Gluten"]
    },
    {
      name: "Classic Bruschetta",
      description: "Toasted bread topped with diced tomatoes, garlic, and fresh basil",
      price: 7.99,
      ingredients: ["Cabbage", "Carrots", "Mushrooms"],
      photo: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f",
      available: false,
      labels: ["Vegetarian", "Italian"],
      allergens: ["Gluten"]
    }
  ]
};