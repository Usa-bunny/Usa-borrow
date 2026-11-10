import { z } from "zod";

export const kategoriSchema = z.object({
  id: z.string(), 
  kode_kategori: z.string(),
  nama_kategori: z.string(),
  deskripsi: z.string().nullable().optional(),
});

export type Kategori = z.infer<typeof kategoriSchema>; 