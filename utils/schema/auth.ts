import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(2, "password must be at least 2 characters.")
    .max(30, "password must be at most 30 characters."),
});