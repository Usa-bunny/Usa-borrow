"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { getColumns } from "./_components/columns";
import type { ActivityLog } from "./_components/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SectionStatistic } from "@/components/other/section-statistic";

export default function ActivityLogPage() {
  const { query } = useCrud<ActivityLog, any>({
    table: "activity_logs",
    queryKey: ["activity_logs"],
    select: "*, user:users(nama_lengkap)",
    orderBy: { column: "created_at", ascending: false },
  });

  const { data = [], isFetching, isLoading, refetch } = query;
  const [detailData, setDetailData] = React.useState<ActivityLog | null>(null);

  const columns = React.useMemo(
    () =>
      getColumns({
        onDetail: (item) => setDetailData(item),
      }),
    [],
  );

  const statistic = [
    {
      label: "Total Log",
      value: isLoading ? "..." : data.length.toString(),
    },
    {
      label: "Tambah",
      value: isLoading
        ? "..."
        : data.filter((d) => d.aksi === "TAMBAH").length.toString(),
    },
    {
      label: "Edit",
      value: isLoading
        ? "..."
        : data.filter((d) => d.aksi === "UBAH").length.toString(),
    },
    {
      label: "Hapus",
      value: isLoading
        ? "..."
        : data.filter((d) => d.aksi === "HAPUS").length.toString(),
    },
  ];

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
              searchPlaceholder="Cari aktivitas..."
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

      <Dialog
        open={!!detailData}
        onOpenChange={(open) => !open && setDetailData(null)}
      >
        <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Detail Log Aktivitas</DialogTitle>
            <DialogDescription className="text-base">
              Aksi{" "}
              <span className="font-bold text-foreground">
                {detailData?.aksi}
              </span>{" "}
              pada tabel{" "}
              <span className="font-bold text-foreground">
                {detailData?.tabel}
              </span>{" "}
              oleh{" "}
              <span className="font-bold text-foreground">
                {detailData?.user?.nama_lengkap || "Sistem"}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {detailData?.data_lama && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-sm text-red-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Data Lama (Sebelum)
                  </h3>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border border-border">
                    {JSON.stringify(detailData.data_lama, null, 2)}
                  </pre>
                </div>
              )}

              {detailData?.data_baru && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-sm text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    Data Baru (Sesudah)
                  </h3>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border border-border">
                    {JSON.stringify(detailData.data_baru, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
