import { Card, Typography, Chip } from "@mui/material";
import { RestaurantType } from "@/types";

export default function RestaurantStats({ details }: { details: RestaurantType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-gray-900/50">
        <Typography color="text.secondary">Status</Typography>
        <div className="mt-2">
          <Chip
            label={details.status || 'Inactive'}
            color={details.status === 'active' ? 'success' : "error"}
          />
        </div>
      </Card>
      <Card className="p-4 bg-gray-900/50">
        <Typography color="text.secondary">Cuisine</Typography>
        <Typography variant="h6" className="mt-2">{details.cuisine}</Typography>
      </Card>
      <Card className="p-4 bg-gray-900/50">
        <Typography color="text.secondary">Total Orders</Typography>
        <Typography variant="h6" className="mt-2">{details.orders || 120}</Typography>
      </Card>
    </div>
  );
}
