"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useCrud } from "@/hooks/use-crud";
import { pengajuanSchema, type PengajuanInput } from "./schema";

export function FormDrawer({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PengajuanInput) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection={isMobile ? "down" : "right"}
      showSwipeHandle={isMobile}
    >
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Ajukan Peminjaman</DrawerTitle>
          <DrawerDescription>
            Pilih alat dan tentukan tanggal peminjaman.
          </DrawerDescription>
        </DrawerHeader>

        <Form
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DrawerContent>
    </Drawer>
  );
}

function Form({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: PengajuanInput) => void;
  onCancel: () => void;
}) {
  const { query: alatQuery } = useCrud<any, any>({
    table: "alat",
    queryKey: ["alat"],
    orderBy: { column: "nama_alat" },
  });

  const initialValues: PengajuanInput = {
    id_alat: "",
    jumlah: 1,
    tgl_pinjam: new Date().toISOString().slice(0, 10),
    tgl_kembali: "",
  };

  const { values, errors, set, handleSubmit } = useFormValidation(
    initialValues,
    pengajuanSchema,
    onSubmit,
  );

  const selectedAlat = alatQuery.data?.find((a: any) => a.id === values.id_alat);

  return (
    <>
      <form
        id="pengajuan-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
      >
        <div className="flex flex-col gap-3">
          <Label>Alat</Label>
          <Select
            value={values.id_alat}
            onValueChange={(v) => v && set("id_alat", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={alatQuery.isLoading ? "Memuat..." : "Pilih alat"}
              >
                {selectedAlat?.nama_alat}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {alatQuery.data?.map((a: any) => (
                <SelectItem key={a.id} value={a.id} disabled={a.stok <= 0}>
                  {a.nama_alat} (stok: {a.stok})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_alat && (
            <p className="text-xs text-destructive">{errors.id_alat}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="jumlah">Jumlah Pinjam</Label>
          <Input
            id="jumlah"
            type="number"
            min={1}
            max={selectedAlat?.stok || 1} // Batasi maksimal sesuai stok
            value={values.jumlah}
            onChange={(e) => set("jumlah", parseInt(e.target.value) || 0)}
            aria-invalid={!!errors.jumlah}
          />
          {errors.jumlah && (
            <p className="text-xs text-destructive">{errors.jumlah}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="tgl_pinjam">Tanggal Pinjam</Label>
          <Input
            id="tgl_pinjam"
            type="date"
            value={values.tgl_pinjam}
            onChange={(e) => set("tgl_pinjam", e.target.value)}
            aria-invalid={!!errors.tgl_pinjam}
          />
          {errors.tgl_pinjam && (
            <p className="text-xs text-destructive">{errors.tgl_pinjam}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="tgl_kembali">Tanggal Rencana Kembali</Label>
          <Input
            id="tgl_kembali"
            type="date"
            value={values.tgl_kembali}
            onChange={(e) => set("tgl_kembali", e.target.value)}
            aria-invalid={!!errors.tgl_kembali}
          />
          {errors.tgl_kembali && (
            <p className="text-xs text-destructive">{errors.tgl_kembali}</p>
          )}
        </div>
      </form>

      <DrawerFooter>
        <Button type="submit" form="pengajuan-form">
          Kirim Pengajuan
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </DrawerFooter>
    </>
  );
}