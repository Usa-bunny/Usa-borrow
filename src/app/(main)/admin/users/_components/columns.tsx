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
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ColumnActions } from "@/components/crud/crud-table";
import type { User, UserRole } from "./schema";

const columnHelper = createColumnHelper<Features, User>();

const ROLE_STYLES: Record<UserRole, string> = {
  Admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Petugas: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Peminjam: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  );
}

export function getColumns({ onEdit, onDelete }: ColumnActions<User>) {
  return columnHelper.columns([
    columnHelper.accessor("nama_lengkap", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Lengkap" />
      ),
      enableHiding: false,
      enableSorting: true,
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("role", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
      enableSorting: true,
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
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ]);
}
