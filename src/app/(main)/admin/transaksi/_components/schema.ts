import { z } from "zod";

export const peminjamanStatusSchema = z.enum([
  "Menunggu",
  "Disetujui",
  "Dipinjam",
  "Ditolak",
  "Selesai",
]);
export type PeminjamanStatus = z.infer<typeof peminjamanStatusSchema>;

export const peminjamanSchema = z.object({
  id: z.string(),
  kode_transaksi: z.string(),
  id_user: z.string().nullable().optional(),
  id_alat: z.string().nullable().optional(),
  jumlah: z.number(),
  tgl_pinjam: z.string(),
  tgl_kembali: z.string(),
  tgl_dikembalikan: z.string().nullable().optional(),
  kondisi_alat: z.string().nullable().optional(),
  status: peminjamanStatusSchema,
  created_at: z.string(),
  user: z.object({ nama_lengkap: z.string() }).optional().nullable(),
  alat: z.object({ nama_alat: z.string() }).optional().nullable(),
});

export type Peminjaman = z.infer<typeof peminjamanSchema>;