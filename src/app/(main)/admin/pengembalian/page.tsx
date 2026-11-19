"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";
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
import { SectionStatistic } from "@/components/other/section-statistic";
import { usePeminjaman } from "@/hooks/use-peminjaman";
import { getColumns } from "./_components/columns";
import { FormDrawer, type InputData } from "./_components/form-drawer";
import type { Peminjaman } from "./_components/schema";

export default function ManagePengembalianPage() {
  const { query, mutations, changeStatus } = usePeminjaman();
  const { data = [], isFetching, refetch } = query;
  const {
    update,
    delete: deleteMutation,
    isPending,
  } = mutations;

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Peminjaman | null>(null);
  const [deleting, setDeleting] = React.useState<Peminjaman | null>(null);

  const filteredData = React.useMemo(() => {
    return data.filter((d) => d.status === "Selesai");
  }, [data]);

  const statistic = [
    {
      label: "Selesai",
      value: data.filter((d) => d.status === "Selesai").length.toString(),
    },
    {
      label: "Belum dikembalikan",
      value: data.filter((d) => d.status === "Dipinjam").length.toString(),
    },
  ];

  const handleEdit = React.useCallback((item: Peminjaman) => {
    setEditing(item);
    setFormOpen(true);
  }, []);

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onChangeStatus: (item, status) => {
          changeStatus.mutate(
            { id: item.id, newStatus: status },
            {
              onSuccess: () => toast.success(`Status diubah ke ${status}`),
              onError: (err: any) =>
                toast.error(err?.message ?? "Gagal mengubah status"),
            },
          );
        },
        onDelete: (item) => setDeleting(item),
      }),
    [changeStatus, handleEdit],
  );

  function handleSubmit(values: InputData) {
    if (!editing) return;
    update.mutate(
      { id: editing.id, values },
      {
        onSuccess: () => {
          toast.success("Pengembalian diperbarui");
          setFormOpen(false);
          setEditing(null);
        },
        onError: (err: any) =>
          toast.error(err?.message ?? "Gagal memperbarui"),
      },
    );
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Pengembalian dihapus");
        setDeleting(null);
      },
      onError: (err: any) => toast.error(err?.message ?? "Gagal menghapus"),
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionStatistic items={statistic} />

          <div className="flex flex-col gap-4 px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredData}
              getRowId={(row) => row.id}
              searchPlaceholder="Cari kode transaksi, peminjam, atau alat..."
              toolbar={() => (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching || isPending}
                    title="Refresh data"
                  >
                    <RefreshCwIcon
                      className={isFetching ? "animate-spin" : ""}
                    />
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <FormDrawer
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        data={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengembalian?</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi &quot;{deleting?.kode_transaksi}&quot; akan dihapus
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
    </div>
  );
}