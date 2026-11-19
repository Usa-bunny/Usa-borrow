import { useCrud } from "@/hooks/use-crud";
import type { Alat, AlatInput } from "@/app/(main)/admin/alat/_components/schema";

export function useAlat() {
  return useCrud<Alat, AlatInput>({
    table: "alat",
    queryKey: ["alat"],
    select: "*, kategori(nama_kategori)",
    orderBy: { column: "nama_alat" },
  });
}