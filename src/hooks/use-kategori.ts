import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import type { KategoriInput } from "../app/(main)/admin/kategori/_component_t/form-drawer";
import type { Kategori } from "../app/(main)/admin/kategori/_component_t/schema";

export function useKategori() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["kategori"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kategori")
        .select("*")
        .order("nama_kategori", { ascending: true });

      if (error) throw error;
      return data as Kategori[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useKategoriMutations() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["kategori"] });

  const addKategori = useMutation({
    mutationFn: async (values: KategoriInput) => {
      const { error } = await supabase.from("kategori").insert(values);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateKategori = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: KategoriInput;
    }) => {
      const { error } = await supabase
        .from("kategori")
        .update(values)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteKategori = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("kategori").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addKategori, updateKategori, deleteKategori };
}
