"use client";

import * as React from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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
import { usePeminjaman, generateKodeTransaksi } from "@/hooks/use-peminjaman";
import { getColumns } from "./_components/columns";
import { FormDrawer, type InputData } from "./_components/form-drawer";
import type { Peminjaman } from "./_components/schema";

export default function ManagePeminjamanPage() {
  const queryClient = useQueryClient();
  const { query, mutations, changeStatus } = usePeminjaman();
  const { data = [], isFetching, refetch } = query;
  const { add, update, delete: deleteMutation, isPending } = mutations;

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Peminjaman | null>(null);
  const [deleting, setDeleting] = React.useState<Peminjaman | null>(null);

  const filteredData = React.useMemo(() => {
    return data.filter((d) => d.status !== "Selesai");
  }, [data]);

  const statistic = [
    {
      label: "Aktif",
      value: data.filter((d) => d.status !== "Selesai").length.toString(),
    },
    {
      label: "Menunggu",
      value: data.filter((d) => d.status === "Menunggu").length.toString(),
    },
    {
      label: "Disetujui",
      value: data.filter((d) => d.status === "Disetujui").length.toString(),
    },
    {
      label: "Dipinjam",
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
              onSuccess: () => {
                toast.success(`Status diubah ke ${status}`)
                queryClient.invalidateQueries({ queryKey: ["alat"] }); 
              },
              onError: (err: any) =>
                toast.error(err?.message ?? "Gagal mengubah status"),
            },
          );
        },
        onDelete: (item) => setDeleting(item),
      }),
    [changeStatus, handleEdit],
  );

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleSubmit(values: InputData) {
    if (editing) {
      update.mutate(
        { id: editing.id, values },
        {
          onSuccess: () => {
            toast.success("Peminjaman diperbarui");
            setFormOpen(false);
            queryClient.invalidateQueries({ queryKey: ["alat"] }); 
          },
          onError: (err: any) =>
            toast.error(err?.message ?? "Gagal memperbarui"),
        },
      );
    } else {
      add.mutate(values, {
        onSuccess: () => {
          toast.success("Peminjaman ditambahkan");
          setFormOpen(false);
        },
        onError: (err: any) => toast.error(err?.message ?? "Gagal menambahkan"),
      });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Peminjaman dihapus");
        setDeleting(null);
        queryClient.invalidateQueries({ queryKey: ["alat"] }); 
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

                  <Button
                    size="sm"
                    onClick={handleAdd}
                    disabled={isFetching || isPending}
                  >
                    <PlusIcon className="mr-2 size-4" />
                    <span className="hidden lg:inline">Tambah Peminjaman</span>
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <FormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        data={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peminjaman?</AlertDialogTitle>
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
