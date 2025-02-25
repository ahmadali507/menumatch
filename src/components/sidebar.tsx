"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems, navItems } from "@/lib/dashboard";
import { FoodBank } from "@mui/icons-material";
import NavList from "./nav-list";

export function SidebarNav({ role }: { role: keyof typeof navItems }) {
  const pathname = usePathname();

  console.log("these are items", navItems[role], navItems, role);

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
          <NavList items={navItems[role]} pathname={pathname} />
        </div>
        <div className="space-y-4 mb-4">
          <hr className="border-t border-gray-600 mx-3" />

          <NavList items={bottomNavItems} pathname={pathname} showGradient={false} />
        </div>
      </div>
    </div>
  );
}