import { Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
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

const quickActions: { title: string; icon: React.ReactNode, color: "primary" | "secondary" | "success" | "error" | "info" | "warning" }[] = [
  { title: "Restaurant Information", icon: <RestaurantIcon />, color: "primary" },
  { title: "Edit Restaurant", icon: <MenuBookIcon />, color: "success" },
  { title: "Manage Menus", icon: <CategoryIcon />, color: "info" },
  { title: "Create Menu", icon: <AnalyticsIcon />, color: "warning" },
];

export default function RestaurantAdminPage() {
  return (
    <section className="pb-6 space-y-6">
      <PageTitle title="Restaurant Overview" description="This is an overview of performance of your restaurant">
        <div className="flex gap-2">

          <Button
            variant="contained"
            color="primary"
            startIcon={<EditRestaurantIcon />}
          >
            Edit Restaurant
          </Button>
          <Link href={routes.menu}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<RestaurantMenuIcon />}

            >
              Manage Menu
            </Button>
          </Link>
        </div>

      </PageTitle>

      {/* Overview Cards */}
      <Stats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MenuPerformance />
        <TopSellingItems />
        <RecentUpdates updates={menuUpdates} />
        <QuickActions actions={quickActions} />
      </div>
    </section>
  );
}

