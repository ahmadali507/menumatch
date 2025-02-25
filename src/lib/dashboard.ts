import { UserData } from "@/types";
import { FoodBankSharp, Home, Logout, Restaurant, Settings } from "@mui/icons-material";


export type SidebarNavItemProps = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

export const navItems: Record<UserData['role'], SidebarNavItemProps[]> = {
  "super_admin": [
    { title: "Home", href: "/", icon: Home },
    { title: "Restaurants", href: "/restaurants", icon: Restaurant },
    // {title:"Admins", href:"/admins", icon:Person},
  ],
  admin: [
    { title: "Home", href: "/restaurant", icon: Home },
    { title: "Information", href: "/restaurant/info", icon: Restaurant },
    { title: "Menus", href: "/restaurant/menu", icon: FoodBankSharp },
  ],
  user: [
    { title: "Home", href: "/", icon: Home },
    { title: "Restaurants", href: "/restaurants", icon: Restaurant },
  ]
};

export const projectMediaItems: SidebarNavItemProps[] = []

export const bottomNavItems: SidebarNavItemProps[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  // { title: "FAQ & Help", href: "/help", icon: HelpCircle },
  { title: "Logout", href: "/logout", icon: Logout },
];