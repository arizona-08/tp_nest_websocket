import z from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100)
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;