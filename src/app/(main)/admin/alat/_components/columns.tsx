"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Features } from "@/components/table/features";
import type { Alat } from "./schema";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

const columnHelper = createColumnHelper<Features, Alat>();

export interface ColumnActions {
  onEdit: (item: Alat) => void;
  onDelete: (item: Alat) => void;
}

export function getColumns({ onEdit, onDelete }: ColumnActions) {
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
        <DataTableColumnHeader column={column} title="Stok" />
      ),
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.kategori?.nama_kategori, {
      id: "nama_kategori",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Kategori" />
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
    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground data-popup-open:bg-muted"
              />
            }
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PencilIcon className="mr-2 size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2Icon className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ]);
}