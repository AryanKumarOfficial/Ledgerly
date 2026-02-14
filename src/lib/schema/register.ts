import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .max(20, { error: "Password must not exceed 20 characters" })
  .refine((v) => /[A-Z]/.test(v), { error: "Must contain uppercase" })
  .refine((v) => /[a-z]/.test(v), { error: "Must contain lowercase" })
  .refine((v) => /\d/.test(v), { error: "Must contain number" })
  .refine((v) => /[@$!%*?&]/.test(v), {
    error: "Must contain special character",
  });

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(256, "Name should be only 256 character long!")
    .refine((val) => val.length >= 4, {
      error: `Name must be atleast 4 character`,
    }),
  email: z.email({ error: `Enter a valid Email ID` }),
  password: passwordSchema,
  phone: z
    .string()
    .nonempty("Phone number is required")
    .max(15, { error: `Phone number not exceed 15 length` })
    .transform((v) => v.replace(/\s|-/g, ""))
    .refine((val) => /^\+?[1-9]\d{7,14}$/.test(val), {
      error: `Invalid phone number`,
    }),
});

export const frontendRegisterSchema = registerSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: `Passwords must match`,
      });
    }
  });

export type Register = z.infer<typeof frontendRegisterSchema>;
