import { SidebarNav } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";
import { PropsWithChildren } from "react";

export default function SuperDashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex">
      {/* Permanent Sidebar - Desktop only */}
      <div className="hidden lg:block w-[280px] h-screen border-r border-1 border-gray-500 bg-zinc-950/90">
        <SidebarNav role="admin" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
