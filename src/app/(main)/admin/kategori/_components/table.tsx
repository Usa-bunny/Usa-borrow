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
import { KategoriFormDrawer, type KategoriInput } from "./form-drawer";
import type { Kategori } from "./schema";
import {
  useKategori,
  useKategoriMutations,
} from "../../../../../hooks/use-kategori";

export function KategoriTable() {
  const { data = [], isFetching, refetch } = useKategori();
  const { addKategori, updateKategori, deleteKategori } =
    useKategoriMutations();

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

  function handleSubmit(values: KategoriInput) {
    if (editing) {
      updateKategori.mutate(
        { id: editing.id, values },
        {
          onSuccess: () => {
            toast.success("Kategori berhasil diperbarui");
            setDrawerOpen(false);
          },
          onError: (error: any) =>
            toast.error(error.message || "Gagal memperbarui"),
        },
      );
    } else {
      addKategori.mutate(values, {
        onSuccess: () => {
          toast.success("Kategori berhasil ditambahkan");
          setDrawerOpen(false);
        },
        onError: (error: any) =>
          toast.error(error.message || "Gagal menambahkan"),
      });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteKategori.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Kategori berhasil dihapus");
        setDeleting(null);
      },
      onError: (error: any) => toast.error(error.message || "Gagal menghapus"),
    });
  }

  const isMutating =
    addKategori.isPending ||
    updateKategori.isPending ||
    deleteKategori.isPending;

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
              disabled={isFetching || isMutating}
              title="Refresh data"
            >
              <RefreshCwIcon className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isFetching || isMutating}
            >
              <PlusIcon className="mr-2 size-4" />
              <span className="hidden lg:inline">Tambah Kategori</span>
            </Button>
          </div>
        )}
      />

      <KategoriFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        kategori={editing}
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
            <AlertDialogCancel disabled={deleteKategori.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteKategori.isPending}
            >
              {deleteKategori.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
