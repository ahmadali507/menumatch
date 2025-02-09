import { Typography } from "@mui/material";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditRestaurant from "../forms/edit-restaurant";
import { RestaurantType } from "@/types";

export default function RestaurantHeader({ restaurantId, details }: {
  restaurantId: string;
  details: RestaurantType
}) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gray-900">
          <RestaurantIcon className="text-blue-500" sx={{ fontSize: 40 }} />
        </div>
        <div>
          <Typography variant="h4">{details.name}</Typography>
          <div className="flex items-center gap-2 mt-1">
            <LocationOnIcon className="text-gray-400" sx={{ fontSize: 18 }} />
            <Typography color="text.secondary">{details.location.city}</Typography>
          </div>
        </div>
      </div>
      <EditRestaurant restaurantId={restaurantId} initialData={{ ...details, cuisine: "Khota" }} />
    </div>
  );
}
