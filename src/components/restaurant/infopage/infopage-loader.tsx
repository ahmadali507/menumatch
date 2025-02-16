import { Card, Grid, Skeleton, Box, Divider } from '@mui/material';

export default function RestaurantInfoLoader() {
  return (
    <div className="flex gap-6 w-full">
      {/* Main Content Card */}
      <Card style={{ flexGrow: 2 }}>
        {/* Header Skeleton */}
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />

          {/* Restaurant Stats */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Menu Management Section */}
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="30%" height={32} />
          <Skeleton variant="text" width="50%" height={24} sx={{ mt: 1 }} />

          {/* Menu Cards Grid */}
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <MenuCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Admins List Sidebar */}
      <Card sx={{ width: 300, display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Box sx={{ mt: 2 }}>
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </div>
  );
}

// Separate component for menu card skeleton
function MenuCardSkeleton() {
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1 }} />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
}