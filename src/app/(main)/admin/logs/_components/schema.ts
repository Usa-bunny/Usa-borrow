import { z } from "zod";

export const activityLogSchema = z.object({
  id: z.string(),
  id_user: z.string().nullable(),
  aksi: z.enum(["TAMBAH", "UBAH", "HAPUS"]),
  tabel: z.string(),
  deskripsi: z.string(),
  data_lama: z.any().nullable(),
  data_baru: z.any().nullable(),
  created_at: z.string(),
  user: z.object({ nama_lengkap: z.string() }).optional().nullable(),
});

export type ActivityLog = z.infer<typeof activityLogSchema>;