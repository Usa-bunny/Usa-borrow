"use client";

import * as React from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import type { UseQueryResult } from "@tanstack/react-query";
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
import type { CrudMutations } from "@/hooks/use-crud";

export interface ColumnActions<TData> {
  onEdit: (item: TData) => void;
  onDelete: (item: TData) => void;
}

export interface CrudFormProps<TData, TInput> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TData | null;
  onSubmit: (values: TInput) => void;
}

export interface CrudTableProps<TData extends { id: string }, TInput> {
  query: UseQueryResult<TData[], Error>;
  mutations: CrudMutations<TInput>;
  getColumns: (actions: ColumnActions<TData>) => any[];
  renderForm: (props: CrudFormProps<TData, TInput>) => React.ReactNode;
  entityName: string; // "Alat", "Kategori", ...
  getItemLabel: (item: TData) => string; // untuk dialog hapus
  searchPlaceholder?: string;
  addButtonLabel?: string;
}

export function CrudTable<TData extends { id: string }, TInput>({
  query,
  mutations,
  getColumns,
  renderForm,
  entityName,
  getItemLabel,
  searchPlaceholder,
  addButtonLabel,
}: CrudTableProps<TData, TInput>) {
  const { data = [], isFetching, refetch } = query;
  const { add, update, delete: deleteMutation, isPending } = mutations;

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TData | null>(null);
  const [deleting, setDeleting] = React.useState<TData | null>(null);

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (item) => {
          setEditing(item);
          setFormOpen(true);
        },
        onDelete: (item) => setDeleting(item),
      }),
    [getColumns],
  );

  const entityLower = entityName.toLowerCase();

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleSubmit(values: TInput) {
    const onSuccess = () => setFormOpen(false);
    const onError = (error: any) =>
      toast.error(error?.message ?? `Gagal menyimpan ${entityLower}`);

    if (editing) {
      update.mutate(
        { id: editing.id, values },
        {
          onSuccess: () => {
            toast.success(`${entityName} berhasil diperbarui`);
            onSuccess();
          },
          onError,
        },
      );
    } else {
      add.mutate(values, {
        onSuccess: () => {
          toast.success(`${entityName} berhasil ditambahkan`);
          onSuccess();
        },
        onError,
      });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`${entityName} berhasil dihapus`);
        setDeleting(null);
      },
      onError: (error: any) =>
        toast.error(error?.message ?? `Gagal menghapus ${entityLower}`),
    });
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        searchPlaceholder={searchPlaceholder}
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
            <Button size="sm" onClick={handleAdd} disabled={isFetching || isPending}>
              <PlusIcon className="mr-2 size-4" />
              <span className="hidden lg:inline">
                {addButtonLabel ?? `Tambah ${entityName}`}
              </span>
            </Button>
          </div>
        )}
      />

      {renderForm({
        open: formOpen,
        onOpenChange: setFormOpen,
        data: editing,
        onSubmit: handleSubmit,
      })}

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              {entityName} &quot;{deleting && getItemLabel(deleting)}&quot; akan
              dihapus permanen.
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