import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useCrud } from "@/hooks/use-crud";
import type {
  Peminjaman,
  PeminjamanStatus,
} from "@/app/(main)/admin/peminjaman/_components/schema";
import type { InputData } from "@/app/(main)/admin/peminjaman/_components/form-drawer";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function generateKodeTransaksi() {
  const ymd = today().replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TRX-${ymd}-${rand}`;
}

export function usePeminjaman() {
  const base = useCrud<Peminjaman, InputData>({
    table: "peminjaman",
    queryKey: ["peminjaman"],
    select: `*, user:users(nama_lengkap), alat:alat(nama_alat)`,
    orderBy: { column: "created_at", ascending: false },
  });

  const queryClient = useQueryClient();
  const supabase = createClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["peminjaman"] });
    // WAJIB: Agar stok di tabel alat langsung ter-refresh di UI
    queryClient.invalidateQueries({ queryKey: ["alat"] });
  };

  const changeStatus = useMutation<
    void,
    Error,
    { id: string; newStatus: PeminjamanStatus }
  >({
    mutationFn: async ({ id, newStatus }) => {
      const updates: Record<string, any> = { status: newStatus };

      if (newStatus === "Selesai") {
        updates.tgl_dikembalikan = today();
      }

      const { error } = await supabase
        .from("peminjaman")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { ...base, changeStatus };
}

export { generateKodeTransaksi };