"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toastContext";
import { logoutUser } from "@/actions/actions.auth";

import { cn } from "@/lib/utils";
import { SidebarNavItemProps } from "@/lib/dashboard";
import Link from "next/link";

export default function NavList({
  items,
  pathname,
  showGradient = true,
}: {
  items: SidebarNavItemProps[];
  pathname: string;
  showGradient?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logoutUser();
    showToast("Logged out successfully", "success");
    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  };

  return (
    <nav className="grid gap-y-2 items-start px-4 text-sm font-medium backdrop-blur-lg">
      {items.map((item) => {
        const active = pathname === item.href;

        if (item.title === "Logout") {
          return (
            <button
              key={item.title}
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-gray-700 hover:text-white w-full"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-gray-700 hover:text-white",
              active && showGradient && "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span >{item.title}</span>
            {item.badge && (
              <span className="ml-auto rounded bg-blue-500 px-2 text-xs">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}