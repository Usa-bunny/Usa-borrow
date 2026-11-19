"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { Features } from "@/components/table/features";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { Peminjaman, PeminjamanStatus } from "@/app/(main)/admin/peminjaman/_components/schema";

const columnHelper = createColumnHelper<Features, Peminjaman>();

const STATUS_STYLES: Record<PeminjamanStatus, string> = {
  Menunggu: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Disetujui: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Dipinjam: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Ditolak: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Selesai: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

function StatusBadge({ status }: { status: PeminjamanStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function getColumns() {
  return columnHelper.columns([
    columnHelper.accessor("kode_transaksi", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kode Transaksi" />
      ),
      enableHiding: false,
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.user?.nama_lengkap, {
      id: "peminjam",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Peminjam" />
      ),
      cell: ({ row }) => <span>{row.original.user?.nama_lengkap || "-"}</span>,
    }),
    columnHelper.accessor((row) => row.alat?.nama_alat, {
      id: "alat",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Alat" />
      ),
      cell: ({ row }) => <span>{row.original.alat?.nama_alat || "-"}</span>,
    }),
    columnHelper.accessor("jumlah", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Jumlah" />
      ),
    }),
    columnHelper.accessor("tgl_pinjam", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tgl Pinjam" />
      ),
    }),
    columnHelper.accessor("tgl_kembali", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rencana Kembali" />
      ),
    }),
    columnHelper.accessor("tgl_dikembalikan", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Aktual Kembali" />
      ),
      cell: ({ row }) => (
        <span className={!row.original.tgl_dikembalikan ? "text-muted-foreground" : ""}>
          {row.original.tgl_dikembalikan || "-"}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    }),
  ]);
}