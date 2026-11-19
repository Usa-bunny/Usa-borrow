"use client";

import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { peminjamanSchema, type Peminjaman } from "./schema";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useCrud } from "@/hooks/use-crud";

export type InputData = {
  kode_transaksi: string;
  id_user: string;
  id_alat: string;
  jumlah: number;
  tgl_pinjam: string;
  tgl_kembali: string;
};

const inputSchema = z.object({
  kode_transaksi: z.string().min(1, "Kode transaksi wajib diisi"),
  id_user: z.string().min(1, "Peminjam wajib dipilih"),
  id_alat: z.string().min(1, "Alat wajib dipilih"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  tgl_pinjam: z.string().min(1, "Tanggal pinjam wajib diisi"),
  tgl_kembali: z.string().min(1, "Tanggal kembali wajib diisi"),
});

export function FormDrawer({
  open,
  onOpenChange,
  data,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Peminjaman | null;
  onSubmit: (values: InputData) => void;
}) {
  const isEdit = !!data;
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
          <DrawerTitle>
            {isEdit ? "Edit Peminjaman" : "Tambah Peminjaman"}
          </DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? "Ubah data peminjaman lalu simpan."
              : "Isi form untuk menambahkan peminjaman baru."}
          </DrawerDescription>
        </DrawerHeader>

        <Form
          data={data}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          isEdit={isEdit}
        />
      </DrawerContent>
    </Drawer>
  );
}

function Form({
  data,
  onSubmit,
  onCancel,
  isEdit,
}: {
  data: Peminjaman | null;
  onSubmit: (values: InputData) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const { query: userQuery } = useCrud<any, any>({
    table: "users",
    queryKey: ["users"],
    orderBy: { column: "nama_lengkap" },
  });
  const { query: alatQuery } = useCrud<any, any>({
    table: "alat",
    queryKey: ["alat"],
    orderBy: { column: "nama_alat" },
  });

  const initialValues: InputData = data
    ? {
        kode_transaksi: data.kode_transaksi,
        id_user: data.id_user ?? "",
        id_alat: data.id_alat ?? "",
        jumlah: data.jumlah,
        tgl_pinjam: data.tgl_pinjam,
        tgl_kembali: data.tgl_kembali,
      }
    : {
        kode_transaksi: "",
        id_user: "",
        id_alat: "",
        jumlah: 1,
        tgl_pinjam: new Date().toISOString().slice(0, 10),
        tgl_kembali: "",
      };

  const { values, errors, set, handleSubmit } = useFormValidation(
    initialValues,
    inputSchema,
    onSubmit,
  );

  const selectedUser = userQuery.data?.find((u: any) => u.id === values.id_user);
  const selectedAlat = alatQuery.data?.find((a: any) => a.id === values.id_alat);

  return (
    <>
      <form
        id="peminjaman-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="kode_transaksi">Kode Transaksi</Label>
          <Input
            id="kode_transaksi"
            value={values.kode_transaksi}
            onChange={(e) => set("kode_transaksi", e.target.value)}
            aria-invalid={!!errors.kode_transaksi}
          />
          {errors.kode_transaksi && (
            <p className="text-xs text-destructive">{errors.kode_transaksi}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label>Peminjam</Label>
          <Select
            value={values.id_user}
            onValueChange={(v) => v && set("id_user", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={userQuery.isLoading ? "Memuat..." : "Pilih peminjam"}>
                {selectedUser?.nama_lengkap}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {userQuery.data?.map((u: any) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.nama_lengkap}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_user && (
            <p className="text-xs text-destructive">{errors.id_user}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label>Alat</Label>
          <Select
            value={values.id_alat}
            onValueChange={(v) => v && set("id_alat", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={alatQuery.isLoading ? "Memuat..." : "Pilih alat"}>
                {selectedAlat?.nama_alat}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {alatQuery.data?.map((a: any) => (
                <SelectItem key={a.id} value={a.id}>
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
          <Label htmlFor="jumlah">Jumlah</Label>
          <Input
            id="jumlah"
            type="number"
            min={1}
            value={values.jumlah}
            onChange={(e) => set("jumlah", parseInt(e.target.value) || 0)}
            aria-invalid={!!errors.jumlah}
          />
          {errors.jumlah && (
            <p className="text-xs text-destructive">{errors.jumlah}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="tgl_pinjam">Tanggal Pinjam (Rencana)</Label>
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
          <Label htmlFor="tgl_kembali">Tanggal Kembali (Rencana)</Label>
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
        <Button type="submit" form="peminjaman-form">
          {isEdit ? "Simpan Perubahan" : "Tambah"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </DrawerFooter>
    </>
  );
}