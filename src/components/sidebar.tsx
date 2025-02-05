"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


import { cn } from "@/utils/utils";
import { bottomNavItems, navItems, projectMediaItems, SidebarNavItemProps } from "@/lib/dashboard";
import { FoodBank } from "@mui/icons-material";

function NavList({
  items,
  pathname,
  showGradient = true,
}: {
  items: SidebarNavItemProps[];
  pathname: string;
  showGradient?: boolean;
}) {
  return (
    <nav className="grid gap-y-2 items-start px-4 text-sm font-medium backdrop-blur-lg">
      {items.map((item) => {
        const active = item.href === "/"
          ? pathname === item.href
          : pathname.split("/").includes(item.href.slice(1));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-gray-700 hover:text-white",
              active && showGradient && "bg-gradient-to-r from-purple-600 to-purple-400 text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span >{item.title}</span>
            {item.badge && (
              <span className="ml-auto rounded bg-purple-500 px-2 text-xs">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarNav() {
  const pathname = usePathname();


  return (
    <div className="flex h-full flex-col gap-y-2 overflow-hidden">
      <div className="flex h-14 items-center border-gray-600 px-6">
        <Link
          href="/"
          className="text-white text-xl flex items-center gap-2 font-semibold"
        >
          <FoodBank className="h-6 w-6" />
          <span>MenuManage</span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-between overflow-auto py-2">
        <div className="mt-2 space-y-4">
          <NavList items={navItems} pathname={pathname} />
          <hr className="border-t border-gray-600 mx-3" />
          <NavList items={projectMediaItems} pathname={pathname} />
        </div>
        <div className="space-y-4 mb-4">
          <hr className="border-t border-gray-600 mx-3" />

          <NavList items={bottomNavItems} pathname={pathname} showGradient={false} />
        </div>
      </div>
    </div>
  );
}