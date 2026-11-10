"use client";

import * as React from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/table/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getColumns } from "./columns";
import { FormDrawer, type InputData } from "./form-drawer";
import type { Kategori } from "./schema";
import { useCrud } from "@/hooks/use-crud";

export function CRUDTable() {
  const { query, mutations } = useCrud<Kategori, InputData>({
    table: "kategori",
    queryKey: ["kategori"],
    orderBy: { column: "nama_kategori" },
  });

  const { data = [], isFetching, refetch } = query;
  const { add, update, delete: deleteMutation, isPending } = mutations;

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Kategori | null>(null);
  const [deleting, setDeleting] = React.useState<Kategori | null>(null);

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (item) => {
          setEditing(item);
          setDrawerOpen(true);
        },
        onDelete: (item) => setDeleting(item),
      }),
    [],
  );

  function handleAdd() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function handleSubmit(values: InputData) {
    if (editing) {
      update.mutate(
        { id: editing.id, values },
        {
          onSuccess: () => {
            toast.success("Alat berhasil diperbarui");
            setDrawerOpen(false);
          },
          onError: (error: any) =>
            toast.error(error.message || "Gagal memperbarui"),
        },
      );
    } else {
      add.mutate(values, {
        onSuccess: () => {
          toast.success("Alat berhasil ditambahkan");
          setDrawerOpen(false);
        },
        onError: (error: any) =>
          toast.error(error.message || "Gagal menambahkan"),
      });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Alat berhasil dihapus");
        setDeleting(null);
      },
      onError: (error: any) => toast.error(error.message || "Gagal menghapus"),
    });
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        searchPlaceholder="Cari kode atau nama kategori..."
        toolbar={() => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching || isPending}
              title="Refresh data"
            >
              <RefreshCwIcon className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isFetching || isPending}
            >
              <PlusIcon className="mr-2 size-4" />
              <span className="hidden lg:inline">Tambah Kategori</span>
            </Button>
          </div>
        )}
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        data={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori &quot;{deleting?.nama_kategori}&quot; akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
