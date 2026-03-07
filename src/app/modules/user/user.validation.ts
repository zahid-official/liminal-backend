import z from "zod";
import { Role, AccountStatus } from "./user.interface.js";

// createUserSchema Function
export const createUserSchema = z.object({
  // Name field
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name must be at most 50 characters long" })
    .trim(),

  // Email field
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Email must be a valid email address",
    })
    .min(5, { error: "Email must be at least 5 characters long" })
    .max(50, { error: "Email must be at most 50 characters long" })
    .trim(),

  // Password field
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(8, { error: "Password must be at least 8 characters long" })

    // Password complexity requirements
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number.",
    })
    .trim(),
});

export const updateUserSchema = z.object({
  // Name field
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name must be at most 50 characters long" })
    .trim()
    .optional(),

  // Email field
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Email must be a valid email address",
    })
    .min(5, { error: "Email must be at least 5 characters long" })
    .max(50, { error: "Email must be at most 50 characters long" })
    .trim()
    .optional(),

  // Password field
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(8, { error: "Password must be at least 8 characters long" })

    // Password complexity requirements
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number.",
    })
    .trim()
    .optional(),

  // Phone
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      error:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .trim()
    .optional(),

  // Address
  address: z
    .string({ error: "Address must be string" })
    .max(200, { error: "Address cannot exceed 200 characters." })
    .trim()
    .optional(),

  // Role
  role: z.enum(Object.values(Role) as [string]).optional(),

  // Account status
  status: z.enum(Object.values(AccountStatus) as [string]).optional(),

  // Delete status
  isDeleted: z.boolean({ error: "isDeleted must be true or false" }).optional(),

  // Verification status
  isVerified: z
    .boolean({ error: "isVerified must be true or false" })
    .optional(),
});
