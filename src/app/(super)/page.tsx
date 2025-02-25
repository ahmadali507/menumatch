import { Typography, Card } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupIcon from "@mui/icons-material/Group";
import AddRestaurant from "@/components/add-restaurant";
import { Metadata } from "next";
import RecentActivity from "@/components/recent-activity";
import RestaurantAdmins from "@/components/restaurant-admins";

export const metadata: Metadata = {
  title: "Super Admin",
  description: "Manage all restaurants and admins in one place",
}

const StatCard = ({
  icon,
  title,
  value,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
}) => (
  <Card className="p-4 md:p-6 flex flex-col gap-3 md:gap-4 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center">
      <div className="p-1.5 md:p-2 rounded-lg bg-gray-900">{icon}</div>
      {trend && (
        <span className={`text-sm md:text-base font-bold ${trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        {value}
      </Typography>
    </div>
  </Card>
);

export default function MainPage() {
  return (
    <section className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        <Typography component="h2" variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Overview
        </Typography>
        <div className="w-full sm:w-auto">
          <AddRestaurant />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <StatCard
          icon={<RestaurantIcon className="text-blue-500" />}
          title="Total Restaurants"
          value="124"
          trend="+12.5%"
        />
        <StatCard
          icon={<MenuBookIcon className="text-purple-500" />}
          title="Active Menus"
          value="25"
          trend="+8.1%"
        />
        <StatCard
          icon={<GroupIcon className="text-green-500" />}
          title="Total Admins"
          value="22"
          trend="+22.4%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
        <RecentActivity />
        <RestaurantAdmins />
      </div>
    </section>
  );
}
