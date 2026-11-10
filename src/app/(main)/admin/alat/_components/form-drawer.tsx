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
import { useIsMobile } from "@/hooks/use-mobile";
import { alatSchema, type Alat } from "./schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useCrud } from "@/hooks/use-crud";

export type InputData = Omit<Alat, "id" | "kategori">;

const inputSchema = alatSchema.omit({ id: true, kategori: true }).extend({
  kode_alat: alatSchema.shape.kode_alat.min(1, "Kode Alat wajib diisi"),
  nama_alat: alatSchema.shape.nama_alat.min(1, "Nama Alat wajib diisi"),
  id_kategori: alatSchema.shape.id_kategori.min(1, "Kategori wajib diisi"),
  stok: z.number().min(0, "Stok tidak boleh negatif"),
});

export function FormDrawer({
  open,
  onOpenChange,
  data,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Alat | null;
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
          <DrawerTitle>{isEdit ? "Edit Alat" : "Tambah Alat"}</DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? "Ubah data alat lalu simpan."
              : "Isi form di bawah untuk menambahkan alat baru."}
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
  data: Alat | null;
  onSubmit: (values: InputData) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const { query: kategoriQuery } = useCrud<any, any>({
    table: "kategori",
    queryKey: ["kategori"],
    orderBy: { column: "nama_kategori" }
  });

  const initialValues: InputData = data
    ? {
        kode_alat: data.kode_alat,
        nama_alat: data.nama_alat,
        id_kategori: data.id_kategori,
        stok: data.stok,
        deskripsi: data.deskripsi || "",
      }
    : {
        kode_alat: "",
        nama_alat: "",
        id_kategori: "",
        stok: 0,
        deskripsi: "",
      };

  const { values, errors, set, handleSubmit } = useFormValidation(
    initialValues,
    inputSchema,
    onSubmit
  );

  const selectedKategori = kategoriQuery.data?.find(
    (k: any) => k.id === values.id_kategori
  );

  return (
    <>
      <form
        id="kategori-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="kode_alat">Kode Alat</Label>
          <Input
            id="kode_alat"
            value={values.kode_alat}
            onChange={(e) => set("kode_alat", e.target.value)}
            aria-invalid={!!errors.kode_alat}
          />
          {errors.kode_alat && (
            <p className="text-xs text-destructive">{errors.kode_alat}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="nama_alat">Nama Alat</Label>
          <Input
            id="nama_alat"
            value={values.nama_alat}
            onChange={(e) => set("nama_alat", e.target.value)}
            aria-invalid={!!errors.nama_alat}
          />
          {errors.nama_alat && (
            <p className="text-xs text-destructive">{errors.nama_alat}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="stok">Stok</Label>
          <Input
            id="stok"
            type="number"
            value={values.stok}
            onChange={(e) => set("stok", parseInt(e.target.value) || 0)}
            aria-invalid={!!errors.stok}
          />
          {errors.stok && (
            <p className="text-xs text-destructive">{errors.stok}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="kategori">Kategori</Label>
          <Select
            value={values.id_kategori}
            onValueChange={(v) => v && set("id_kategori", v)}
          >
            <SelectTrigger id="kategori" className="w-full">
              <SelectValue placeholder={kategoriQuery.isLoading ? "Memuat..." : "Pilih kategori"}>
                {selectedKategori?.nama_kategori}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {kategoriQuery.data?.map((v: any) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_kategori && (
            <p className="text-xs text-destructive">{errors.id_kategori}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
          <Input
            id="deskripsi"
            value={values.deskripsi || ""}
            onChange={(e) => set("deskripsi", e.target.value)}
          />
        </div>
      </form>

      <DrawerFooter>
        <Button type="submit" form="kategori-form">
          {isEdit ? "Simpan Perubahan" : "Tambah"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </DrawerFooter>
    </>
  );
}