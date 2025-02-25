import { Card, Skeleton } from "@mui/material";

export default function DashboardSkeleton() {
  return (
    <section className="pb-6 space-y-4 sm:space-y-6 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Skeleton variant="rectangular" width={150} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="px-2 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={60} />
              </div>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={40} className="mt-2" />
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
        {/* Menu Performance Card */}
        <Card className="p-4 md:p-6">
          <Skeleton variant="text" width="40%" height={32} className="mb-4" />
          <Skeleton variant="rectangular" height={200} />
        </Card>

        {/* Top Selling Items Card */}
        <Card className="p-4 md:p-6">
          <Skeleton variant="text" width="40%" height={32} className="mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="rectangular" width={60} height={60} />
                <div className="flex-1">
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </div>
                <Skeleton variant="text" width={50} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Updates Card */}
        <Card className="p-4 md:p-6">
          <Skeleton variant="text" width="40%" height={32} className="mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="30%" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}