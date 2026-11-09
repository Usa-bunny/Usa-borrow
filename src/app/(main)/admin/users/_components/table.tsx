"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
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
import { DocumentFormDrawer, type DocumentInput } from "./form-drawer";
import type { Document } from "./schema";

export function DocumentTable({ data: initialData }: { data: Document[] }) {
  const [data, setData] = React.useState(initialData);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Document | null>(null);
  const [deleting, setDeleting] = React.useState<Document | null>(null);

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

  function handleSubmit(values: DocumentInput) {
    if (editing) {
      setData((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)),
      );
      toast.success("Data berhasil diperbarui");
    } else {
      setData((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1;
        return [{ id: nextId, ...values }, ...prev];
      });
      toast.success("Data berhasil ditambahkan");
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    setData((prev) => prev.filter((d) => d.id !== deleting.id));
    toast.success("Data berhasil dihapus");
    setDeleting(null);
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id.toString()}
        searchPlaceholder="Cari header, type, reviewer..."
        toolbar={() => (
          <Button size="sm" onClick={handleAdd}>
            <PlusIcon />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        )}
      />

      <DocumentFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        document={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.header}&quot; akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}