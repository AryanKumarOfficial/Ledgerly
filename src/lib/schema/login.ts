import { z } from "zod";
import { passwordSchema } from "./register";

export const loginSchema = z.object({
  email: z.email({ error: `Invalid Email ID` }),
  password: passwordSchema,
});

export type Login = z.infer<typeof loginSchema>;
