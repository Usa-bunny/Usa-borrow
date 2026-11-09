"use client";

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Column, RowData } from "@tanstack/react-table";
import type { Features } from "./features";

interface Props<TData extends RowData, TValue> {
  column: Column<Features, TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: Props<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <div className={cn("flex", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 data-[sorted=true]:text-foreground"
        data-sorted={!!sorted}
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        {title}
        {sorted === "asc" ? (
          <ArrowUpIcon />
        ) : sorted === "desc" ? (
          <ArrowDownIcon />
        ) : (
          <ChevronsUpDownIcon className="text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
