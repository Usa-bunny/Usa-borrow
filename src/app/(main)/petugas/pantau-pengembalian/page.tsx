"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SectionStatistic } from "@/components/other/section-statistic";
import { usePeminjaman } from "@/hooks/use-peminjaman";
import { getColumns } from "./_components/columns";

export default function PantauPengembalianPage() {
  const { query } = usePeminjaman();
  const { data = [], isFetching, refetch } = query;

  const filteredData = React.useMemo(() => {
    return data.filter((d) => d.status === "Dipinjam" || d.status === "Selesai");
  }, [data]);

  const statistic = [
    {
      label: "Sedang Dipinjam",
      value: data.filter((d) => d.status === "Dipinjam").length.toString(),
    },
    {
      label: "Sudah Dikembalikan",
      value: data.filter((d) => d.status === "Selesai").length.toString(),
    },
  ];

  const columns = React.useMemo(() => getColumns(), []);

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
                    disabled={isFetching}
                    title="Refresh data"
                  >
                    <RefreshCwIcon
                      className={isFetching ? "animate-spin" : ""}
                    />
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}