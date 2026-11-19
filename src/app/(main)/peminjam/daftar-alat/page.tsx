"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SectionStatistic } from "@/components/other/section-statistic";
import { useAlat } from "@/hooks/use-alat";
import { getColumns } from "./_components/columns";

export default function PeminjamDaftarAlatPage() {
  const { query } = useAlat();
  const { data = [], isLoading, isFetching, refetch } = query;

  const statistic = [
    {
      label: "Total Alat",
      value: isLoading ? "..." : data.length.toString(),
    },
    {
      label: "Total Unit Tersedia",
      value: isLoading
        ? "..."
        : data.reduce((sum, d) => sum + (d.stok ?? 0), 0).toString(),
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
              data={data}
              getRowId={(row) => row.id}
              searchPlaceholder="Cari kode atau nama alat..."
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
