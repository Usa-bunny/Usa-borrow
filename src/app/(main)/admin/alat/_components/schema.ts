import { z } from "zod";

export const alatSchema = z.object({
  id: z.string(), 
  kode_alat: z.string(),
  nama_alat: z.string(),
  id_kategori: z.string(),
  stok: z.number(),
  deskripsi: z.string().nullable().optional(),
  kategori: z.object({
    nama_kategori: z.string(),
  }).optional().nullable(),
});

export type Alat = z.infer<typeof alatSchema>;