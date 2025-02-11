'use client'

import { getCardStyles } from "@/lib/utils/styles/cardStyles"
import { useTheme, alpha } from "@mui/material/styles";
import { Box, Card, Typography } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data - replace with your actual data
const data = [
  { name: 'Mon', orders: 400, revenue: 2400 },
  { name: 'Tue', orders: 300, revenue: 1398 },
  { name: 'Wed', orders: 200, revenue: 9800 },
  { name: 'Thu', orders: 278, revenue: 3908 },
  { name: 'Fri', orders: 189, revenue: 4800 },
  { name: 'Sat', orders: 239, revenue: 3800 },
  { name: 'Sun', orders: 349, revenue: 4300 },
];

export default function MenuPerformance() {
  const theme = useTheme();
  
  // Custom chart styles based on theme
  const chartStyles = {
    background: theme.palette.mode === 'dark' 
      ? theme.palette.background.paper 
      : theme.palette.background.default,
    text: theme.palette.text.secondary,
    grid: alpha(theme.palette.divider, 0.1),
    tooltip: {
      background: theme.palette.background.paper,
      border: theme.palette.divider,
      text: theme.palette.text.primary
    },
    lines: {
      orders: {
        stroke: theme.palette.primary.main,
        fill: alpha(theme.palette.primary.main, 0.1)
      },
      revenue: {
        stroke: theme.palette.secondary.main,
        fill: alpha(theme.palette.secondary.main, 0.1)
      }
    }
  };

  return (
    <Card
      className="lg:col-span-2"
      sx={{ ...getCardStyles(theme), p: 3 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Menu Performance
      </Typography>
      <Box
        sx={{
          height: 300,
          bgcolor: chartStyles.background,
          borderRadius: 1,
          p: 2
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={chartStyles.grid} 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke={chartStyles.text}
              tick={{ fill: chartStyles.text }}
              axisLine={{ stroke: chartStyles.grid }}
            />
            <YAxis 
              stroke={chartStyles.text}
              tick={{ fill: chartStyles.text }}
              axisLine={{ stroke: chartStyles.grid }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: chartStyles.tooltip.background,
                border: `1px solid ${chartStyles.tooltip.border}`,
                borderRadius: theme.shape.borderRadius,
                color: chartStyles.tooltip.text,
                boxShadow: theme.shadows[3]
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                color: chartStyles.text
              }}
            />
            <Line
              name="Orders"
              type="monotone"
              dataKey="orders"
              stroke={chartStyles.lines.orders.stroke}
              strokeWidth={2}
              fill={chartStyles.lines.orders.fill}
              dot={{ 
                fill: chartStyles.lines.orders.stroke,
                strokeWidth: 2
              }}
              activeDot={{ 
                r: 8,
                strokeWidth: 0
              }}
            />
            <Line
              name="Revenue"
              type="monotone"
              dataKey="revenue"
              stroke={chartStyles.lines.revenue.stroke}
              strokeWidth={2}
              fill={chartStyles.lines.revenue.fill}
              dot={{ 
                fill: chartStyles.lines.revenue.stroke,
                strokeWidth: 2
              }}
              activeDot={{ 
                r: 8,
                strokeWidth: 0
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}