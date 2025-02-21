import { Menu, MenuItem, MenuSection, RestaurantType } from "@/types";

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Margherita Pizza",
    description: "Fresh basil, mozzarella, and our signature tomato sauce",
    ingredients: ["Tomato sauce", "Fresh mozzarella", "Basil", "Olive oil"],
    price: 12.99,
    allergens: ["Dairy", "Gluten"],
    available: true,
    labels: ["Vegetarian"],
    photo: "",
  },
  {
    id: "2",
    name: "Spicy Chicken Wings",
    description: "Crispy wings tossed in our secret hot sauce",
    ingredients: ["Chicken wings", "Hot sauce", "Butter", "Spices"],
    price: 10.99,
    allergens: ["Dairy"],
    available: true,
    labels: ["Spicy", "Popular"],
    photo: "",
  },
  {
    id: "3",
    name: "Buddha Bowl",
    description: "Quinoa, roasted vegetables, and tahini dressing",
    ingredients: ["Quinoa", "Sweet potato", "Chickpeas", "Kale", "Tahini"],
    price: 14.99,
    allergens: ["Sesame"],
    available: true,
    labels: ["Vegan", "Gluten-free", "Healthy"],
    photo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  },
  {
    id: "4",
    name: "Beef Shawarma Plate",
    description: "Tender marinated beef with rice and hummus",
    ingredients: ["Beef", "Rice", "Hummus", "Pita bread"],
    price: 16.99,
    allergens: ["Gluten", "Sesame"],
    available: true,
    labels: ["Halal", "Popular"],
    photo: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783",
  },
  {
    id: "5",
    name: "Green Curry",
    description: "Authentic Thai curry with coconut milk",
    ingredients: ["Coconut milk", "Thai basil", "Vegetables", "Green curry paste"],
    price: 15.99,
    allergens: ["Shellfish"],
    available: true,
    labels: ["Spicy", "Gluten-free"],
    photo: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
  },
];

const sections: MenuSection[] = [
  {
    id: "s1",
    name: "Starters",
    items: [menuItems[1], { ...menuItems[2], id: "6" }],
  },
  {
    id: "s2",
    name: "Main Courses",
    items: [
      menuItems[0],
      menuItems[3],
      menuItems[4],
      {
        ...menuItems[0],
        id: "7",
        name: "Pepperoni Pizza",
        description: "Classic pepperoni with mozzarella",
        labels: ["Popular"],
      },
    ],
  },
  {
    id: "s3",
    name: "Healthy Options",
    items: [
      menuItems[2],
      {
        ...menuItems[2],
        id: "8",
        name: "Mediterranean Salad",
        description: "Fresh vegetables with feta cheese",
        labels: ["Vegetarian", "Healthy"],
      },
    ],
  },
  {
    id: "s4",
    name: "Beverages",
    items: [
      {
        id: "9",
        name: "Fresh Mint Lemonade",
        description: "Handcrafted refreshing lemonade with fresh mint",
        ingredients: ["Lemon", "Mint", "Sugar", "Water"],
        price: 4.99,
        allergens: [],
        available: true,
        labels: ["Vegan", "Popular"],
      },
      {
        id: "10",
        name: "Mango Lassi",
        description: "Traditional Indian yogurt drink with mango",
        ingredients: ["Mango", "Yogurt", "Sugar"],
        price: 5.99,
        allergens: ["Dairy"],
        available: true,
        labels: ["Vegetarian"],
      },
    ],
  },
];

export const dummyMenu: Menu = {
  id: "menu1",
  name: "Main Menu",
  availabilityType: "indefinite",
  sections: sections,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
  qrCode: {
    url: "https://example.com/qr",
    createdAt: new Date(),
  },
};

export const dummyRestaurant: RestaurantType = {
  id: "rest1",
  name: "Fusion Flavors",
  location: {
    address: "123 Foodie Street",
    city: "Culinary City",
    state: "Food State",
    country: "Tasty Land",
  },
  contact: {
    phone: "+1 (555) 123-4567",
    email: "info@fusionflavors.com",
  },
  images: {
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    background: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
  },
  status: "active",
  cuisine: "International Fusion",
  orders: 1234,
  admins: [
    {
      restaurantId: "rest1",
      name: "John Manager",
      email: "john@fusionflavors.com",
      role: "manager",
    },
  ],
  menus: [dummyMenu],
};

// Add more menu variations
export const dummyMenus: Menu[] = [
  dummyMenu,
  {
    ...dummyMenu,
    id: "menu2",
    name: "Ramadan Special",
    availabilityType: "ramadan",
    startDate: new Date(2024, 2, 11),
    endDate: new Date(2024, 3, 9),
  },
  {
    ...dummyMenu,
    id: "menu3",
    name: "Weekend Brunch",
    availabilityType: "custom",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    sections: sections.map(s => ({
      ...s,
      items: s.items.map(item => ({
        ...item,
        price: item.price * 0.8, // 20% discount
      }))
    })),
  },
];

// Updated restaurant with multiple menus
export const dummyRestaurantWithMenus: RestaurantType = {
  ...dummyRestaurant,
  menus: dummyMenus,
};
