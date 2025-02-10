"use client";

import { Card, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MenuBookIcon from "@mui/icons-material/MenuBook";


export const StatCard = ({
  icon,
  title,
  value,
  trend,
  trendLabel,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  trendLabel?: string;
}) => (
  <Card
    className="p-6 flex flex-col gap-4"
    sx={{
      border: theme => `1px solid ${theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)'
        }`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        backgroundColor: theme =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
        boxShadow: theme => theme.shadows[8]
      }
    }}
  >
    <div className="flex justify-between items-center">
      <div className="p-2 rounded-lg bg-gray-900">{icon}</div>
      {trend && (
        <div className="flex flex-col items-end">
          <span
            className={`font-bold ${trend.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
          >
            {trend}
          </span>
          <span className="text-xs text-gray-500">{trendLabel}</span>
        </div>
      )}
    </div>
    <div>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </div>
  </Card>
);


export default function Stats() {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      icon={<MenuBookIcon className="text-blue-500" />}
      title="Total Menu Items"
      value="48"
      trend="+5"
      trendLabel="vs last month"
    />
    <StatCard
      icon={<TrendingUpIcon className="text-green-500" />}
      title="Menu Views"
      value="2.4k"
      trend="+12.5%"
      trendLabel="vs last month"
    />
    <StatCard
      icon={<RestaurantMenuIcon className="text-purple-500" />}
      title="Popular Items"
      value="15"
      trend="+3"
      trendLabel="trending items"
    />
    <StatCard
      icon={<ShoppingBasketIcon className="text-orange-500" />}
      title="Recent Orders"
      value="156"
      trend="+8.1%"
      trendLabel="vs last week"
    />
  </div>
}