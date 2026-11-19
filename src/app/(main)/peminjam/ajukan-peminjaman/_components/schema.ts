import { z } from "zod";

export type PengajuanInput = {
  id_alat: string;
  jumlah: number;
  tgl_pinjam: string;
  tgl_kembali: string;
};

export const pengajuanSchema = z.object({
  id_alat: z.string().min(1, "Alat wajib dipilih"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  tgl_pinjam: z.string().min(1, "Tanggal pinjam wajib diisi"),
  tgl_kembali: z.string().min(1, "Tanggal kembali wajib diisi"),
});
