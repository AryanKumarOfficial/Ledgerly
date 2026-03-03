import { z } from "zod";

export const profileSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full Name must be atleast 2 characters")
      .max(100, "Full Name is too long")
      .trim()
      .optional(),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 Digits")
      .optional(),
    timezone: z.string().min(1, "Timezone is required").optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.fullName !== undefined ||
      data.phone !== undefined ||
      data.timezone !== undefined,
    {
      error: `At least one field must be provided`,
    },
  );

export type Profile = z.infer<typeof profileSchema>;
