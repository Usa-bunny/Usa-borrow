"use client";

import * as React from "react";
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
import { kategoriSchema, type Kategori } from "./schema";
import { useFormValidation } from "@/hooks/use-form-validation";

export type InputData = Omit<Kategori, "id">;

const inputSchema = kategoriSchema.omit({ id: true }).extend({
  kode_kategori: kategoriSchema.shape.kode_kategori.min(
    1,
    "Kode kategori wajib diisi",
  ),
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Kategori | null;
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
  data: Kategori | null;
  onSubmit: (values: InputData) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const initialValues: InputData = data
    ? {
        kode_kategori: data.kode_kategori,
        nama_kategori: data.nama_kategori,
        deskripsi: data.deskripsi || "",
      }
    : {
        kode_kategori: "",
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
        <div className="flex flex-col gap-3">
          <Label htmlFor="kode_kategori">Kode Kategori</Label>
          <Input
            id="kode_kategori"
            value={values.kode_kategori}
            onChange={(e) => set("kode_kategori", e.target.value)}
            aria-invalid={!!errors.kode_kategori}
          />
          {errors.kode_kategori && (
            <p className="text-xs text-destructive">{errors.kode_kategori}</p>
          )}
        </div>

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
