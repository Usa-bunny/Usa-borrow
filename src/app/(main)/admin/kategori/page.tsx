"use client";

import { SectionStatistic } from "@/components/other/section-statistic";
import { CrudTable } from "@/components/table/crud-table";
import { useKategori } from "@/hooks/use-kategori";
import { getColumns } from "./_components/columns";
import { FormDrawer } from "./_components/form-drawer";
import type { Kategori, KategoriInput } from "./_components/schema";

export default function ManageKategoriPage() {
  const { query, mutations } = useKategori();
  const { data = [], isLoading } = query;

  const statistic = [
    {
      label: "Total Kategori",
      value: isLoading ? "..." : data.length.toString(),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionStatistic items={statistic} />
          <div className="flex flex-col gap-4 px-4 lg:px-6">
            <CrudTable<Kategori, KategoriInput>
              query={query}
              mutations={mutations}
              getColumns={getColumns}
              renderForm={(props) => <FormDrawer {...props} />}
              entityName="Kategori"
              getItemLabel={(item) => item.nama_kategori}
              searchPlaceholder="Cari kode atau nama kategori..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
