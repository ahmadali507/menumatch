'use client';
import { Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getCardStyles } from "@/lib/utils/styles/cardStyles";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
  trendLabel?: string;
}

export default function StatCard({ icon, title, value, trend, trendLabel }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card sx={{ ...getCardStyles(theme) }} className="p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="p-2 rounded-lg bg-gray-900">{icon}</div>
        {trend && (
          <div className="flex flex-col items-end">
            <span className={`font-bold ${trend.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}>
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
}
