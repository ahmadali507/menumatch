import { Card, Skeleton } from "@mui/material";

export default function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton variant="rectangular" width="250px" height={40} />
        <Skeleton variant="rectangular" width="150px" height={40} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 md:p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="30%" />
            </div>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={40} className="mt-2" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <Skeleton variant="text" width="40%" height={32} className="mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <Skeleton variant="text" width="40%" height={32} className="mb-4" />
          <div className="space-y-3">
            <Skeleton variant="rectangular" height={100} />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton variant="rectangular" height={60} />
              <Skeleton variant="rectangular" height={60} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}