import z from "zod";

const editRestaurantSchema = z.object({
  restaurantName: z.string()
    .min(3, "Restaurant name must be at least 3 characters"),
    // .max(50, "Restaurant name must not exceed 50 characters"),
  cuisine: z.string()
    .min(2, "Cuisine type is required")
    .max(30, "Cuisine type must not exceed 30 characters"),
  status: z.enum(["active", "inactive"]),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
  }),
  contact: z.object({
    phone: z.string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
    email: z.string()
      .email("Please enter a valid email address"),
  }),

  logo: z.any().optional(),
  background: z.any().optional(),
});

export type TEditRestaurant = z.infer<typeof editRestaurantSchema>;
export { editRestaurantSchema };
