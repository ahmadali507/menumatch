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
  orders: number,
  admins: resAdminType[],
  menus: Menu[],
}

export type resAdminType = {
  restaurantId: string,
  name: string,
  email: string,
  role: string,
  password?: string,
  // idToken ?: string, 
}



export interface MenuSection {
  id: string, 
  name: string;
  items: MenuItem[];
  createdAt?: Date;
}

export interface Menu {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  sections: MenuSection[];
  qrCode?: {
    url: string;
    createdAt: Date;
  };
}

export interface UserData {
  uid: string;
  role: "super_admin" | "admin" | "user",
  email: string,
  restaurantId?: string | null,
  name?: string,
}



export type LocationDataType = {
  [key: string]: {
    [states: string] : {
      [key: string]: string[]
    }
  }
}

export interface MenuItem {
  id?:string; 
  name: string;
  description: string;
  ingredients: string[];
  photo?: string;
  price: number;
  allergens: string[];
  available: boolean;
  labels: string[];
}
