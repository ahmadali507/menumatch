import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import UpdateIcon from "@mui/icons-material/Update";
import MenuPerformance from "@/components/restaurant/dashboard/menu-performance";
import TopSellingItems from "@/components/restaurant/dashboard/top-selling-items";
import RecentUpdates from "@/components/restaurant/dashboard/recent-updates";
import QuickActions from "@/components/restaurant/dashboard/quick-actions";
import Stats from "@/components/restaurant/dashboard/stats";
import EditRestaurantIcon from '@mui/icons-material/EditLocation';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Suspense } from 'react';
import DashboardLoader from '@/components/restaurant/dashboard/dashboard-loader';

import { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import PageTitle from "@/components/restaurant/dashboard/page-title";

export const metadata: Metadata = {
  title: "Restaurant Dashboard",
  description: "Manage your restaurant's menu and orders"
}

const menuUpdates = [
  {
    id: 1,
    text: "Added new seasonal menu items",
    date: "2024-02-10T10:30:00Z",
    icon: <AddIcon />,
  },
  {
    id: 2,
    text: "Updated prices for beverages",
    date: "2024-02-09T15:45:00Z",
    icon: <EditIcon />,
  },
  {
    id: 3,
    text: "Modified dish descriptions",
    date: "2024-02-09T09:20:00Z",
    icon: <UpdateIcon />,
  },
];

const quickActions: { title: string; icon: React.ReactNode, link: string, color: "primary" | "secondary" | "success" | "error" | "info" | "warning" }[] = [
  { title: "Restaurant Information", icon: <RestaurantIcon />, color: "primary", link: "/restaurant/info" },
  { title: "Manage Menus", icon: <CategoryIcon />, color: "info", link: "/restaurant/menu" },
  { title: "Create Menu", icon: <AnalyticsIcon />, color: "warning", link: "/restaurant/menu/add" },
];

export default function RestaurantAdminPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <RestaurantContent />
    </Suspense>
  );
}

async function RestaurantContent() {
  return (
    <section className="pb-6 space-y-4 sm:space-y-6 sm:px-6 lg:px-8">
      <PageTitle title="Restaurant Overview" description="This is an overview of performance of your restaurant">
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditRestaurantIcon />}
            fullWidth={false}
            size="medium"
            className="text-sm sm:text-base whitespace-nowrap"
          >
            Edit Restaurant
          </Button>
          <Link href={routes.menu} className="w-full sm:w-auto">
            <Button
              variant="outlined"
              color="success"
              startIcon={<RestaurantMenuIcon />}
              fullWidth={true}
              size="medium"
              className="text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
            >
              Manage Menu
            </Button>
          </Link>
        </div>
      </PageTitle>

      {/* Overview Cards */}
      <div className="px-2 sm:px-0">
        <Stats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
        <MenuPerformance />
        <TopSellingItems />
        <RecentUpdates updates={menuUpdates} />
        <QuickActions actions={quickActions} />
      </div>
    </section>
  );
}

