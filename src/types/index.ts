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
  images?: {
    logo: string,
    background: string,
  },
  status: "active" | "inactive",
  cuisine: string,
  orders: number,
  admins: resAdminType[],
  menus: Menu[],

}

export type resAdminType = {
  id: string, 
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
  availabilityType: 'indefinite' | 'custom' | 'ramadan';
  startDate?: Date;  // Optional since indefinite menus don't have dates
  endDate?: Date;    // Optional since indefinite menus don't have dates
  sections: MenuSection[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  qrCode?: {
    url: string;
    createdAt: Date;
  };
}

export interface MenuVersion {
  id: string;
  menuId: string;
  tag: string;
  menuData: Menu;
  createdAt: Date;
}

export interface UserData {
  uid: string;
  role: "super_admin" | "admin" | "user",
  email: string,
  restaurantId?: string | null,
  name?: string,
}

export type VersionDataType = {
  id: string;
  tag: string;
  createdAt: string;
}


export type LocationDataType = {
  [key: string]: {
    [states: string]: {
      [key: string]: string[]
    }
  }
}

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  ingredients: string[];
  photo?: string;
  price: number;
  allergens: string[];
  available: boolean;
  labels: string[];
  createdAt?: Date,
  updatedAt?: Date,
  order?: number,
}
