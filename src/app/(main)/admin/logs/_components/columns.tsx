"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { MoreVerticalIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Features } from "@/components/table/features";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ActivityLog } from "./schema";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const columnHelper = createColumnHelper<Features, ActivityLog>();

export interface ActivityLogActions {
  onDetail: (item: ActivityLog) => void;
}

const AKSI_STYLES: Record<string, string> = {
  TAMBAH: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  UBAH: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  HAPUS: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function getColumns({ onDetail }: ActivityLogActions) {
  return columnHelper.columns([
    columnHelper.accessor("created_at", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waktu" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {format(new Date(row.original.created_at), "dd MMM yyyy, HH:mm", { locale: localeId })}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.user?.nama_lengkap, {
      id: "user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Oleh" />
      ),
      cell: ({ row }) => <span>{row.original.user?.nama_lengkap || "Sistem"}</span>,
    }),
    columnHelper.accessor("aksi", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Aksi" />
      ),
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${AKSI_STYLES[row.original.aksi]}`}>
          {row.original.aksi}
        </span>
      ),
    }),
    columnHelper.accessor("tabel", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tabel" />
      ),
      cell: ({ row }) => <span className="capitalize">{row.original.tabel}</span>,
    }),
    columnHelper.accessor("deskripsi", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deskripsi" />
      ),
    }),
    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground data-popup-open:bg-muted" />
              }
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onDetail(item)}>
                <EyeIcon className="mr-2 size-4" /> Lihat Detail Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
}