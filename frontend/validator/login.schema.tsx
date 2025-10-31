import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  otp: z.string().min(4, "Enter valid OTP").optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
