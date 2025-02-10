'use client'

import { getCardStyles } from "@/utils/styles/cardStyles"
import { useTheme } from "@mui/material/styles";
import { Box, Card, Typography } from "@mui/material"

export default function MenuPerformance() {
  const theme = useTheme();
  return <Card
    className="lg:col-span-2"
    sx={{ ...getCardStyles(theme), p: 3 }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      Menu Performance
    </Typography>
    <Box
      sx={{
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.mode === 'dark'
          ? 'background.paper'
          : 'grey.100',
        borderRadius: 1
      }}
    >
      Chart/Graph Placeholder
    </Box>
  </Card>
}