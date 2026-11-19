"use client";

import * as React from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SectionStatistic } from "@/components/other/section-statistic";
import { usePeminjaman } from "@/hooks/use-peminjaman";
import { createClient } from "@/utils/supabase/client";
import { getColumns } from "./_components/columns";
import { FormDrawer } from "./_components/form-drawer";
import type { PengajuanInput } from "./_components/schema";

export default function PeminjamPengajuanPage() {
  const { query, mutations } = usePeminjaman();
  const { data = [], isFetching, refetch } = query;
  const { add, isPending } = mutations;

  const [formOpen, setFormOpen] = React.useState(false);

  const filteredData = React.useMemo(() => {
    return data.filter((d) => d.status !== "Selesai");
  }, [data]);

  const statistic = [
    { label: "Total Pengajuan", value: filteredData.length.toString() },
    {
      label: "Menunggu",
      value: filteredData
        .filter((d) => d.status === "Menunggu")
        .length.toString(),
    },
    {
      label: "Aktif / Dipinjam",
      value: filteredData
        .filter((d) => d.status === "Disetujui" || d.status === "Dipinjam")
        .length.toString(),
    },
  ];

  const columns = React.useMemo(() => getColumns(), []);

  const handleSubmit = async (values: PengajuanInput) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Sesi tidak ditemukan. Silakan login ulang.");
      return;
    }

    add.mutate(
      {
        ...values,
        id_user: user.id, // Otomatis isi dengan ID user yang sedang login
        status: "Menunggu", // Default status
      } as any,
      {
        onSuccess: () => {
          toast.success("Pengajuan berhasil dikirim!");
          setFormOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.message ?? "Gagal mengirim pengajuan");
        },
      },
    );
  };

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
              searchPlaceholder="Cari kode transaksi atau nama alat..."
              toolbar={() => (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching || isPending}
                    title="Refresh data"
                  >
                    <RefreshCwIcon
                      className={isFetching ? "animate-spin" : ""}
                    />
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setFormOpen(true)}
                    disabled={isFetching || isPending}
                  >
                    <PlusIcon className="mr-2 size-4" />
                    <span className="hidden lg:inline">Ajukan Peminjaman</span>
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <FormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
