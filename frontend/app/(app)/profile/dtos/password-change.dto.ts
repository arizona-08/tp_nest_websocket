import z from "zod";

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100)
});

export type PasswordChangeDto = z.infer<typeof PasswordChangeSchema>;