"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { PrinterIcon, RefreshCwIcon } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SectionStatistic } from "@/components/other/section-statistic";
import { usePeminjaman } from "@/hooks/use-peminjaman";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getColumns } from "../pantau-pengembalian/_components/columns";

export default function PetugasLaporanPage() {
  const { query } = usePeminjaman();
  const { data = [], isFetching, refetch } = query;

  const [tglMulai, setTglMulai] = React.useState("");
  const [tglSelesai, setTglSelesai] = React.useState("");

  const [currentDate, setCurrentDate] = React.useState("");

  React.useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter((d) => {
      const matchMulai = tglMulai ? d.tgl_pinjam >= tglMulai : true;
      const matchSelesai = tglSelesai ? d.tgl_pinjam <= tglSelesai : true;
      return matchMulai && matchSelesai;
    });
  }, [data, tglMulai, tglSelesai]);

  const statistic = [
    { label: "Total Transaksi", value: filteredData.length.toString() },
    {
      label: "Selesai",
      value: filteredData
        .filter((d) => d.status === "Selesai")
        .length.toString(),
    },
    {
      label: "Masih Berjalan",
      value: filteredData
        .filter((d) => d.status !== "Selesai")
        .length.toString(),
    },
  ];

  const columns = React.useMemo(() => getColumns(), []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="hidden print:block text-center mb-8">
            <h1 className="text-2xl font-bold">Laporan Peminjaman Alat</h1>
            <p className="text-gray-600">Usa Borrow System</p>
            <p className="text-sm text-gray-500 mt-2">
              Dicetak pada: {currentDate}
            </p>
            <hr className="my-4 border-black" />
          </div>

          <div className="no-print px-4 lg:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-muted/50 p-4 rounded-lg border">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <Label className="text-xs">Dari Tanggal (Pinjam)</Label>
                  <Input
                    type="date"
                    value={tglMulai}
                    onChange={(e) => setTglMulai(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div>
                  <Label className="text-xs">Sampai Tanggal (Pinjam)</Label>
                  <Input
                    type="date"
                    value={tglSelesai}
                    onChange={(e) => setTglSelesai(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCwIcon className={isFetching ? "animate-spin" : ""} />
                </Button>
                <Button size="sm" onClick={handlePrint}>
                  <PrinterIcon className="mr-2 size-4" /> Cetak / Simpan PDF
                </Button>
              </div>
            </div>
          </div>

          <div className="no-print">
            <SectionStatistic items={statistic} />
          </div>

          <div className="flex flex-col gap-4 px-4 lg:px-6 print:px-0">
            <div className="print-table w-full">
              <DataTable
                columns={columns}
                data={filteredData}
                getRowId={(row) => row.id}
                searchPlaceholder="Cari data untuk dicetak..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
