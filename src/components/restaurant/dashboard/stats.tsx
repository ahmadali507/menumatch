"use client";
import { Card, Typography } from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UpdateIcon from '@mui/icons-material/Update';
import { RestaurantStats } from "@/actions/actions.stats";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend?: string;
}

const StatsCard = ({ icon, title, value, trend }: StatsCardProps) => (
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
      <Typography color="text.secondary" variant="body2">
        {title}
      </Typography>
      <Typography variant="h5" component="div">
        {value}
      </Typography>
    </div>
  </Card>
);

export default function Stats({ stats }: { stats: RestaurantStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        icon={<RestaurantMenuIcon className="text-blue-500" />}
        title="Total Menus"
        value={stats.totalMenus}
      />
      <StatsCard
        icon={<GroupIcon className="text-purple-500" />}
        title="Total Admins"
        value={stats.totalAdmins}
      />
      <StatsCard
        icon={<ShoppingCartIcon className="text-green-500" />}
        title="Total Orders"
        value={stats.totalOrders}
      />
      <StatsCard
        icon={<UpdateIcon className="text-orange-500" />}
        title="Recent Orders"
        value={stats.recentOrders}
      />
    </div>
  );
}