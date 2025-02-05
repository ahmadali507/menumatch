
export type RestaurantDetailsType = {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  cuisine: string;
  orders: number;
  admins: { name: string; role: string }[];
  menus:Menu[]
};

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