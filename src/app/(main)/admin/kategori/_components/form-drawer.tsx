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

export type KategoriInput = Omit<Kategori, "id">;

const EMPTY: KategoriInput = {
  kode_kategori: "",
  nama_kategori: "",
  deskripsi: "",
};

const inputSchema = kategoriSchema.omit({ id: true }).extend({
  kode_kategori: kategoriSchema.shape.kode_kategori.min(1, "Kode kategori wajib diisi"),
  nama_kategori: kategoriSchema.shape.nama_kategori.min(1, "Nama kategori wajib diisi"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kategori: Kategori | null;
  onSubmit: (values: KategoriInput) => void;
}

export function KategoriFormDrawer({
  open,
  onOpenChange,
  kategori,
  onSubmit,
}: Props) {
  const isEdit = !!kategori;
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

        <KategoriForm
          kategori={kategori}
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

function KategoriForm({
  kategori,
  onSubmit,
  onCancel,
  isEdit,
}: {
  kategori: Kategori | null;
  onSubmit: (values: KategoriInput) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [values, setValues] = React.useState<KategoriInput>(
    kategori
      ? {
          kode_kategori: kategori.kode_kategori,
          nama_kategori: kategori.nama_kategori,
          deskripsi: kategori.deskripsi || "",
        }
      : EMPTY,
  );
  

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const set = <K extends keyof KategoriInput>(
    key: K,
    value: KategoriInput[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = inputSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  }

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