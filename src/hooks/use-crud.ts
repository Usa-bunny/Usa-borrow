import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

interface UseCrudOptions {
  table: string;
  queryKey: string[];
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
}

export interface CrudMutations<TInput> {
  add: UseMutationResult<void, Error, TInput, unknown>;
  update: UseMutationResult<void, Error, { id: string; values: TInput }, unknown>;
  delete: UseMutationResult<void, Error, string, unknown>;
  isPending: boolean;
}

export function useCrud<TData, TInput>({
  table,
  queryKey,
  select = "*",
  orderBy,
}: UseCrudOptions) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query: UseQueryResult<TData[], Error> = useQuery({
    queryKey,
    queryFn: async () => {
      let req = supabase.from(table).select(select);
      if (orderBy) {
        req = req.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }
      const { data, error } = await req;
      if (error) throw error;
      return data as TData[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addMutation = useMutation<void, Error, TInput>({
    mutationFn: async (values) => {
      const { error } = await supabase.from(table).insert(values as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation<
    void,
    Error,
    { id: string; values: TInput }
  >({
    mutationFn: async ({ id, values }) => {
      const { error } = await supabase
        .from(table)
        .update(values as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
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
      isPending:
        addMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending,
    } satisfies CrudMutations<TInput>,
  };
}