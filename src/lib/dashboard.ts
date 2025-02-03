import { Home, Logout, Settings, VideoFile } from "@mui/icons-material";


export type SidebarNavItemProps = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

export const navItems: SidebarNavItemProps[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Videos", href: "/videos", icon: VideoFile },
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