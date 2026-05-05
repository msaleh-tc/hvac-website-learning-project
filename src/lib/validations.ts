import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const serviceRequestSchema = z.object({
  type: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
  category: z.enum([
    "AC_REPAIR", "AC_INSTALLATION", "AC_MAINTENANCE",
    "HEATING_REPAIR", "HEATING_INSTALLATION", "HEATING_MAINTENANCE",
    "DUCT_CLEANING", "THERMOSTAT", "EMERGENCY", "INSPECTION", "OTHER",
  ]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "EMERGENCY"]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  preferredDate: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
