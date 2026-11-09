"use client";

import { createColumnHelper } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Features } from "@/components/table/features";
import type { Document } from "./schema";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

const columnHelper = createColumnHelper<Features, Document>();

export interface ColumnActions {
  onEdit: (item: Document) => void;
  onDelete: (item: Document) => void;
}

export function getColumns({ onEdit, onDelete }: ColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("header", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Header" />
      ),
      enableHiding: false,
      enableSorting: true,
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Section Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </Badge>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.status === "Done" ? (
            <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
          ) : (
            <LoaderIcon />
          )}
          {row.original.status}
        </Badge>
      ),
    }),
    columnHelper.accessor("target", {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Target"
          className="justify-end"
        />
      ),
      cell: ({ row }) => (
        <div className="text-right">{row.original.target}</div>
      ),
    }),
    columnHelper.accessor("limit", {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Limit"
          className="justify-end"
        />
      ),
      cell: ({ row }) => <div className="text-right">{row.original.limit}</div>,
    }),
    columnHelper.accessor("reviewer", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reviewer" />
      ),
      cell: ({ row }) =>
        row.original.reviewer === "Assign reviewer" ? (
          <span className="text-muted-foreground italic">
            Belum ada reviewer
          </span>
        ) : (
          row.original.reviewer
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
              <PencilIcon /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2Icon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ]);
}
