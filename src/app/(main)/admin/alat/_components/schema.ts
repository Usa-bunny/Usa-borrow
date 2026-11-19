import { z } from "zod";

// 1. Bentuk data (hasil SELECT dari DB)
export const alatSchema = z.object({
  id: z.string(),
  kode_alat: z.string(),
  nama_alat: z.string(),
  id_kategori: z.string(),
  stok: z.number(),
  deskripsi: z.string().nullable().optional(),
  kategori: z
    .object({ nama_kategori: z.string() })
    .optional()
    .nullable(),
});

export type Alat = z.infer<typeof alatSchema>;

// 2. Bentuk input (untuk form)
export const alatInputSchema = alatSchema
  .omit({ id: true, kategori: true })
  .extend({
    kode_alat: z.string().min(1, "Kode Alat wajib diisi"),
    nama_alat: z.string().min(1, "Nama Alat wajib diisi"),
    id_kategori: z.string().min(1, "Kategori wajib diisi"),
    stok: z.number().min(0, "Stok tidak boleh negatif"),
    deskripsi: z.string().optional(), // form pakai "", bukan null
  });

export type AlatInput = z.infer<typeof alatInputSchema>;