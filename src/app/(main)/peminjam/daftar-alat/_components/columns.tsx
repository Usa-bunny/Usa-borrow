"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { Features } from "@/components/table/features";
import type { Alat } from "@/app/(main)/admin/alat/_components/schema";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

const columnHelper = createColumnHelper<Features, Alat>();

export function getColumns() {
  return columnHelper.columns([
    columnHelper.accessor("kode_alat", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kode Alat" />
      ),
      enableHiding: false,
      enableSorting: true,
    }),
    columnHelper.accessor("nama_alat", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Alat" />
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("stok", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stok Tersedia" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const stok = row.original.stok;
        return (
          <span
            className={
              stok === 0 ? "text-destructive font-bold" : "font-medium"
            }
          >
            {stok}
          </span>
        );
      },
    }),
    columnHelper.accessor((row) => row.kategori?.nama_kategori, {
      id: "nama_kategori",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kategori" />
      ),
      cell: ({ row }) => (
        <span>{row.original.kategori?.nama_kategori || "-"}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("deskripsi", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deskripsi" />
      ),
      cell: ({ row }) => (
        <span
          className={
            !row.original.deskripsi ? "text-muted-foreground italic" : ""
          }
        >
          {row.original.deskripsi || "Tidak ada deskripsi"}
        </span>
      ),
    }),
  ]);
}
