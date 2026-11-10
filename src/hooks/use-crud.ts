import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

interface UseCrudOptions {
  table: string;
  queryKey: string[];
  select?: string; // Tambahkan opsi select custom
  orderBy?: { column: string; ascending?: boolean };
}

export function useCrud<TData, TInput>({ 
  table, 
  queryKey, 
  select = "*", // Default select semua kolom
  orderBy 
}: UseCrudOptions) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let req = supabase.from(table).select(select);
      if (orderBy) {
        req = req.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }
      const { data, error } = await req;
      if (error) throw error;
      return data as TData[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addMutation = useMutation({
    mutationFn: async (values: TInput) => {
      const { error } = await supabase.from(table).insert(values as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: TInput }) => {
      const { error } = await supabase.from(table).update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { 
    query, 
    mutations: { 
      add: addMutation, 
      update: updateMutation, 
      delete: deleteMutation,
      isPending: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    } 
  };
}