import { Home, Logout, Person, Restaurant, Settings } from "@mui/icons-material";


export type SidebarNavItemProps = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

export const navItems: SidebarNavItemProps[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Restaurants", href: "/restaurants", icon: Restaurant },
  {title:"Admins", href:"/admins", icon:Person},
  // { title: "Images", href: "/images", icon: ImagesIcon },
  // { title: "Schedule", href: "/schedule", icon: Palette },
  // { title: "Jaba Bot", href: "/chatbot", icon: MessageCircleIcon },

];

export const projectMediaItems: SidebarNavItemProps[] = []

export const bottomNavItems: SidebarNavItemProps[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  // { title: "FAQ & Help", href: "/help", icon: HelpCircle },
  { title: "Logout", href: "/logout", icon: Logout },
];