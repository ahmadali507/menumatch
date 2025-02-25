import z from "zod";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

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

export const menuAvailabilityTypes = ['indefinite', 'custom', 'ramadan'] as const;
export type MenuAvailabilityType = typeof menuAvailabilityTypes[number];

export const addMenuFormSchema = z.object({
  name: z.string()
    .min(3, "Menu name must be at least 3 characters")
    .max(50, "Menu name must be less than 50 characters"),
  availabilityType: z.enum(menuAvailabilityTypes),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  language: z.enum(SUPPORTED_LANGUAGES.map(l => l.code) as [string, ...string[]]),
}).refine((data) => {
  if (data.availabilityType === 'custom') {
    return data.startDate && data.endDate && data.endDate > data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date for custom scheduling",
  path: ["endDate"],
});

export type TAddMenuFormSchema = z.infer<typeof addMenuFormSchema>;

export const itemSchema = z.object({
  name: z.string()
    .min(2, "Item name must be at least 2 characters")
    .max(50, "Item name must not exceed 50 characters"),

  description: z.string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional().default(""),

  price: z.number()
    .max(99999.99, "Price must not exceed 99,999.99")
    .optional().default(0),

  ingredients: z.array(z.string())
    .max(20, "Cannot have more than 20 ingredients")
    .optional()
    .default([]),

  allergens: z.array(z.string())
    .max(10, "Cannot have more than 10 allergens")
    .optional()
    .default([]),

  labels: z.array(z.string())
    .max(5, "Cannot have more than 5 labels")
    .optional()
    .default([]),

  available: z.boolean()
    .optional()
    .default(true),

  createdAt: z.date()
    .optional()
});

export type ItemSchemaType = z.infer<typeof itemSchema>;