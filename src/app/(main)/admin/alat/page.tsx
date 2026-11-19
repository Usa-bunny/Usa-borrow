"use client";

import { SectionStatistic } from "@/components/other/section-statistic";
import { CrudTable } from "@/components/table/crud-table";
import { useAlat } from "@/hooks/use-alat";
import { getColumns } from "./_components/columns";
import { FormDrawer } from "./_components/form-drawer";
import type { Alat, AlatInput } from "./_components/schema";

export default function ManageAlatPage() {
  const { query, mutations } = useAlat();
  const { data = [], isLoading } = query;

  const statistic = [
    { label: "Total Alat", value: isLoading ? "..." : data.length.toString() },
    {
      label: "Total Unit",
      value: isLoading
        ? "..."
        : data.reduce((sum, d) => sum + (d.stok ?? 0), 0).toString(),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionStatistic items={statistic} />
          <div className="flex flex-col gap-4 px-4 lg:px-6">
            <CrudTable<Alat, AlatInput>
              query={query}
              mutations={mutations}
              getColumns={getColumns}
              renderForm={(props) => <FormDrawer {...props} />}
              entityName="Alat"
              getItemLabel={(item) => item.nama_alat}
              searchPlaceholder="Cari kode atau nama alat..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
