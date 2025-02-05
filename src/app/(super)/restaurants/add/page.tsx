import AddRestaurantForm from "@/components/forms/add-restaurant";
import { Typography } from "@mui/material";

export default function AddRestaurantPage() {

  return (
    <section className="p-6 space-y-6">
      <div className="mb-6">
        <Typography component="h2" variant="h4">
          Add Restaurant
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Input restaurant details to create a new Restaurant
        </Typography>
      </div>

      <AddRestaurantForm />
    </section>
  );
}