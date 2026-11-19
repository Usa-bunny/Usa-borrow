"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SectionStatistic } from "@/components/other/section-statistic";
import { usePeminjaman } from "@/hooks/use-peminjaman";
import { getColumns } from "./_components/columns";
// Import useQueryClient untuk refresh tabel alat jika stok berubah
import { useQueryClient } from "@tanstack/react-query"; 

export default function PetugasPersetujuanPage() {
  const { query, changeStatus } = usePeminjaman();
  const { data = [], isFetching, refetch } = query;
  const queryClient = useQueryClient();

  // Menampilkan semua data peminjaman yang BELUM selesai
  const filteredData = React.useMemo(() => {
    return data.filter((d) => d.status !== "Selesai");
  }, [data]);

  // Statistik Ringkas untuk Petugas
  const statistic = [
    {
      label: "Menunggu Persetujuan",
      value: data.filter((d) => d.status === "Menunggu").length.toString(),
    },
    {
      label: "Siap Diserahkan",
      value: data.filter((d) => d.status === "Disetujui").length.toString(),
    },
    {
      label: "Sedang Dipinjam",
      value: data.filter((d) => d.status === "Dipinjam").length.toString(),
    },
  ];

  const columns = React.useMemo(
    () =>
      getColumns({
        onChangeStatus: (item, status) => {
          changeStatus.mutate(
            { id: item.id, newStatus: status },
            {
              onSuccess: () => {
                toast.success(`Status berhasil diubah ke ${status}`);
                // Jika status jadi Dipinjam/Selesai, trigger database akan mengurangi/menambah stok alat
                // Kita perlu invalidate cache "alat" agar UI form peminjaman lain ikut update stoknya
                queryClient.invalidateQueries({ queryKey: ["alat"] });
              },
              onError: (err: any) =>
                toast.error(err?.message ?? "Gagal mengubah status"),
            }
          );
        },
      }),
    [changeStatus, queryClient]
  );

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
                  {/* TIDAK ADA TOMBOL TAMBAH UNTUK PETUGAS */}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}