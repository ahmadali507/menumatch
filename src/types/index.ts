// import { string } from "zod";

export type RestaurantDetailsType = {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  cuisine: string;
  orders: number;
  admins: { name: string; role: string }[];
  menus: Menu[]
};


export type RestaurantType = {
  name: string,
  id: string,
  location: {
    city: string,
    state: string,
    address: string,
    country: string,
  },
  contact: {
    phone: string,
    email: string,
  },
  status: "active" | "inactive",
  cuisine: string,
  orders?: number,
  admins?: { name: string; role: string }[],
  menus?: Menu[],
}

export type resAdminType = {
  restaurantId: string,
  name: string,
  email: string,
  role: string,
  password?: string,
}
interface MenuItem {
  name: string;
  description: string;
  ingredients: string[];
  photo: string;
  price: number;
  allergens: string[];
  available: boolean;
  labels: string[];
}

interface MenuSection {
  name: string;
  items: MenuItem[];
}

interface Menu {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  sections: MenuSection[];
}

export interface UserData {
  uid: string;
  role: string,
  email: string,
  restaurantId?: string | null,
  name?: string,
}
