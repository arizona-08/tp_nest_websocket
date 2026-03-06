import z from "zod"

export const registerSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
  confirmation: z.string().min(6).max(100)
}).refine((data) => data.password === data.confirmation, {
  message: "Les mots de passe ne correspondent pas",
});

export type RegisterDto = z.infer<typeof registerSchema>;