import { Box, Container, Skeleton, Paper, Grid } from '@mui/material';

export default function PublicMenuSkeleton() {
  return (
    <Box className="min-h-screen">
      {/* Header Skeleton */}
      <Box className="bg-gradient-to-r from-primary-900 to-primary-700 py-6">
        <Container maxWidth="lg">
          <div className="flex gap-6">
            <Skeleton variant="circular" width={80} height={80} />
            <div className="flex-1">
              <Skeleton variant="text" width={300} height={40} />
              <Skeleton variant="text" width={200} height={24} />
            </div>
          </div>
        </Container>
      </Box>

      <Container maxWidth="lg" className="py-8">
        {/* Filters Skeleton */}
        <Paper elevation={0} className="mb-8 p-4">
          <Skeleton variant="text" width={200} height={32} />
          <Box className="flex gap-2 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" width={100} height={32} />
            ))}
          </Box>
        </Paper>

        {/* Sections Skeleton */}
        {[1, 2, 3].map((section) => (
          <Paper key={section} elevation={0} className="p-6 mb-8">
            <Skeleton variant="text" width={200} height={32} className="mb-4" />
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant="rounded" height={200} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Container>
    </Box>
  );
}