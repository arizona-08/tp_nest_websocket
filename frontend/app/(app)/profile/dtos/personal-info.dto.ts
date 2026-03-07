import z from "zod";

export const PersonalInfoSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.email(),
  usernameColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
})

export type PersonalInfoDto = z.infer<typeof PersonalInfoSchema>;