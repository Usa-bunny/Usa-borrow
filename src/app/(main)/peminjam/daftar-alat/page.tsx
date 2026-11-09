import { DataTable } from "@/components/table/data-table";
import { SectionStatistic } from "@/components/other/section-statistic";

import data from "./data.json";

const statistic = [
  { label: "User", value: "50" },
  { label: "User1", value: "50" },
  { label: "User2", value: "50" },
  { label: "User3", value: "50" },
];

export default function DaftarAlatPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionStatistic items={statistic} />
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
