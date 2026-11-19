import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCrud } from "@/hooks/use-crud";
import type { User } from "@/app/(main)/admin/users/_components/schema";
import type { InputData } from "@/app/(main)/admin/users/_components/form-drawer";

export function useUser() {
  const base = useCrud<User, InputData>({
    table: "users",
    queryKey: ["users"],
    orderBy: { column: "nama_lengkap" },
  });

  const queryClient = useQueryClient();

  const deleteUser = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error((await res.text()) || "Gagal menghapus user");
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    ...base,
    mutations: {
      ...base.mutations,
      delete: deleteUser,
      isPending: base.mutations.isPending || deleteUser.isPending,
    },
  };
}