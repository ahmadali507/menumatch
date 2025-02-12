import { Box, Card, Grid, Skeleton } from '@mui/material';

export default function DashboardLoader() {
  return (
    <section className="pb-6 space-y-6">
      {/* Page Title Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={40} />
        <Skeleton variant="text" width="50%" height={24} sx={{ mt: 1 }} />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ p: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="40%" height={21} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid Skeleton */}
      <Grid container spacing={3}>
        {/* Menu Performance */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 1 }} />
          </Card>
        </Grid>

        {/* Top Selling Items */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Skeleton variant="text" width="50%" height={32} />
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={24} />
                  <Skeleton variant="text" width="30%" height={21} />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Recent Updates */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Skeleton variant="text" width="40%" height={32} />
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="90%" height={24} />
                  <Skeleton variant="text" width="40%" height={21} />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item}>
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
}