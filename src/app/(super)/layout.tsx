import { SidebarNav } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";
import { PropsWithChildren } from "react";

export default function SuperDashboardLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen flex">
    {/* Sidebar */}
    <div className="hidden w-[280px] border-r border-1 border-gray-500 bg-zinc-950/90 lg:block">
      <SidebarNav />
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col h-full">
      <SiteHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
}