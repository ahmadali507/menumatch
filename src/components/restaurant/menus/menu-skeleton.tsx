import { Card, CardContent, Skeleton, Box } from "@mui/material";

export default function MenuSkeleton() {
  return (
    <Card elevation={1}>
      <CardContent className="space-y-4">
        <Box className="flex justify-between items-start">
          <Skeleton variant="text" width="60%" height={32} />
          <Box className="flex gap-1">
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
        </Box>

        <Box className="space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="40%" />
        </Box>

        <Box className="flex gap-2">
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
}
