"use client";

import { SectionStatistic } from "@/components/other/section-statistic";
import { KategoriTable } from "./_components/table";
import { useKategori } from "../../../../hooks/use-kategori";

export default function ManageKategoriPage() {
  const { data = [], isLoading } = useKategori();

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
            <KategoriTable />
          </div>
        </div>
      </div>
    </div>
  );
}
