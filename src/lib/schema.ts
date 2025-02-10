import z from "zod";

export const editRestaurantSchema = z.object({
  name: z.string()
    .min(3, "Restaurant name must be at least 3 characters"),
  // .max(50, "Restaurant name must not exceed 50 characters"),
  cuisine: z.string()
    .min(2, "Cuisine type is required")
    .max(30, "Cuisine type must not exceed 30 characters").default("lahori"),
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

export const addRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  cuisine: z.string().min(1, "Cuisine is required"),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
  }),
  contact: z.object({
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Valid email required"),
  }),
});

export type TAddRestaurantSchema = z.infer<typeof addRestaurantSchema>;

// Validation schema
export const addMenuFormSchema = z.object({
  name: z.string()
    .min(3, "Menu name must be at least 3 characters")
    .max(50, "Menu name must be less than 50 characters"),
  startDate: z.date()
    .min(new Date(), "Start date must be in the future"),
  endDate: z.date()
    .min(new Date(), "End date must be in the future"),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type TAddMenuFormSchema = z.infer<typeof addMenuFormSchema>;