'use client';
import { getCardStyles } from "@/utils/styles/cardStyles";
import { Card, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TopSellingItems() {
  const theme = useTheme();

  return <Card
    sx={{ ...getCardStyles(theme), p: 3 }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      Top Selling Items
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {["Margherita Pizza", "Chicken Wings", "Caesar Salad"].map((item, index) => (
        <Box
          key={item}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.08)'
              }`,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.07)'
                : 'rgba(0, 0, 0, 0.04)',
              transform: 'translateX(4px)',
              borderColor: theme.palette.primary.main
            }
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.mode === 'dark'
                ? 'primary.dark'
                : 'primary.light',
              color: theme.palette.mode === 'dark'
                ? 'primary.light'
                : 'primary.dark',
              fontWeight: 600
            }}
          >
            {index + 1}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2">{item}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {Math.floor(Math.random() * 100)} orders this month
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Card>
}
