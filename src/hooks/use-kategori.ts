import { useCrud } from "@/hooks/use-crud";
import type {
  Kategori,
  KategoriInput,
} from "@/app/(main)/admin/kategori/_components/schema";

export function useKategori() {
  return useCrud<Kategori, KategoriInput>({
    table: "kategori",
    queryKey: ["kategori"],
    orderBy: { column: "nama_kategori" },
  });
}