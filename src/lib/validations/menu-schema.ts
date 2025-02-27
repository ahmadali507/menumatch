import { z } from "zod";

export const menuItemSchema = z.object({
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

  createdAt: z.string().or(z.date()).optional(),

});
export const menuSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  items: z.array(menuItemSchema)
});

export const menuSchema = z.object({
  // id: z.string(),
  name: z.string(),
  language: z.string().min(2).max(2).default('en'),
  description: z.string().optional().nullable(),
  sections: z.array(menuSectionSchema),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  status: z.enum(["active", "inactive"], { message: "Invalid status" }),
  availabilityType: z.enum(["ramadan", "custom", "indefinite"], { message: "Invalid availability type" }),
  qrCode: z.object({
    url: z.string(),
    createdAt: z.string().or(z.date()).optional().nullable()
  }).optional(),
  createdAt: z.string().or(z.date()).optional().default(() => new Date().toISOString()),
  updatedAt: z.string().or(z.date()).optional().default(() => new Date().toISOString()),
});
