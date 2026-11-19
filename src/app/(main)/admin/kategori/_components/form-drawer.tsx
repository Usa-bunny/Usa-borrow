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
import { kategoriSchema, type Kategori, type KategoriInput } from "./schema";
import { useFormValidation } from "@/hooks/use-form-validation";
import type { CrudFormProps } from "@/components/table/crud-table";

const inputSchema = kategoriSchema
  .omit({ id: true, kode_kategori: true })
  .extend({
    nama_kategori: kategoriSchema.shape.nama_kategori.min(
      1,
      "Nama kategori wajib diisi",
    ),
  });

export function FormDrawer({
  open,
  onOpenChange,
  data,
  onSubmit,
}: CrudFormProps<Kategori, KategoriInput>) {
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
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? "Ubah data kategori lalu simpan."
              : "Isi form di bawah untuk menambahkan kategori baru."}
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
  data: Kategori | null;
  onSubmit: (values: KategoriInput) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const initialValues: KategoriInput = data
    ? {
        kode_kategori: data.kode_kategori,
        nama_kategori: data.nama_kategori,
        deskripsi: data.deskripsi || "",
      }
    : {
        kode_kategori: "", // Biarkan kosong, DB akan mengisi
        nama_kategori: "",
        deskripsi: "",
      };

  const { values, errors, set, handleSubmit } = useFormValidation(
    initialValues,
    inputSchema,
    onSubmit,
  );

  return (
    <>
      <form
        id="kategori-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
      >
        {isEdit && data && (
          <div className="flex flex-col gap-3">
            <Label>Kode Kategori</Label>
            <Input value={data.kode_kategori} disabled />
            <p className="text-xs text-muted-foreground">
              Kode kategori dibuat otomatis oleh sistem.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Label htmlFor="nama_kategori">Nama Kategori</Label>
          <Input
            id="nama_kategori"
            value={values.nama_kategori}
            onChange={(e) => set("nama_kategori", e.target.value)}
            aria-invalid={!!errors.nama_kategori}
          />
          {errors.nama_kategori && (
            <p className="text-xs text-destructive">{errors.nama_kategori}</p>
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
