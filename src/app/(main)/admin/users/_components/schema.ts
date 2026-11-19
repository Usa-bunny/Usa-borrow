import { z } from "zod";

export const userRoleSchema = z.enum(["Admin", "Petugas", "Peminjam"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string(),
  nama_lengkap: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
});

export type User = z.infer<typeof userSchema>;