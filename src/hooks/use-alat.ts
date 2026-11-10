import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import type { InputData } from "../app/(main)/admin/alat/_components/form-drawer";
import type { Alat } from "../app/(main)/admin/alat/_components/schema";

export function useAlat() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["alat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alat")
        .select("*")
        .order("nama_alat", { ascending: true });

      if (error) throw error;
      return data as Alat[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAlatMutations() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["alat"] });

  const addAlat = useMutation({
    mutationFn: async (values: InputData) => {
      const { error } = await supabase.from("alat").insert(values);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateAlat = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: InputData }) => {
      const { error } = await supabase.from("alat").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteAlat = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alat").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addAlat, updateAlat, deleteAlat };
}
