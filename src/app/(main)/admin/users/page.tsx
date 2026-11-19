"use client";

import { SectionStatistic } from "@/components/other/section-statistic";
import { CrudTable } from "@/components/table/crud-table";
import { useUser } from "@/hooks/use-user";
import { getColumns } from "./_components/columns";
import { FormDrawer, type InputData } from "./_components/form-drawer";
import type { User } from "./_components/schema";

export default function ManageUserPage() {
  const { query, mutations } = useUser();
  const { data = [], isLoading } = query;

  const statistic = [
    { label: "Total User", value: isLoading ? "..." : data.length.toString() },
    {
      label: "Admin",
      value: isLoading
        ? "..."
        : data.filter((d) => d.role === "Admin").length.toString(),
    },
    {
      label: "Petugas",
      value: isLoading
        ? "..."
        : data.filter((d) => d.role === "Petugas").length.toString(),
    },
    {
      label: "Peminjam",
      value: isLoading
        ? "..."
        : data.filter((d) => d.role === "Peminjam").length.toString(),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionStatistic items={statistic} />
          <div className="flex flex-col gap-4 px-4 lg:px-6">
            <CrudTable<User, InputData>
              query={query}
              mutations={mutations}
              getColumns={getColumns}
              renderForm={(props) => <FormDrawer {...props} />}
              entityName="User"
              getItemLabel={(item) => item.nama_lengkap}
              searchPlaceholder="Cari nama atau email user..."
              canCreate={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
