import { z } from "zod";
import { passwordSchema } from "./register";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: passwordSchema,
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: `Password didn't match with new password`,
        path: ["confirmPassword"],
      });
    }
  });

export type ChangePassword = z.infer<typeof changePasswordSchema>;
