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
import { userRoleSchema, type User, type UserRole } from "./schema";
import { useFormValidation } from "@/hooks/use-form-validation";
import type { CrudFormProps } from "@/components/table/crud-table";

export type InputData = {
  nama_lengkap: string;
  role: UserRole;
};

const inputSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  role: userRoleSchema,
});

export function FormDrawer({
  open,
  onOpenChange,
  data,
  onSubmit,
}: CrudFormProps<User, InputData>) {
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
          <DrawerTitle>Edit User</DrawerTitle>
          <DrawerDescription>
            Ubah nama atau role user lalu simpan.
          </DrawerDescription>
        </DrawerHeader>

        <Form
          data={data}
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
  data,
  onSubmit,
  onCancel,
}: {
  data: User | null;
  onSubmit: (values: InputData) => void;
  onCancel: () => void;
}) {
  const initialValues: InputData = data
    ? { nama_lengkap: data.nama_lengkap, role: data.role }
    : { nama_lengkap: "", role: "Peminjam" };

  const { values, errors, set, handleSubmit } = useFormValidation(
    initialValues,
    inputSchema,
    onSubmit,
  );

  return (
    <>
      <form
        id="user-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={data?.email ?? ""} disabled readOnly />
          <p className="text-xs text-muted-foreground">
            Email terikat ke akun auth dan tidak bisa diubah di sini.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
          <Input
            id="nama_lengkap"
            value={values.nama_lengkap}
            onChange={(e) => set("nama_lengkap", e.target.value)}
            aria-invalid={!!errors.nama_lengkap}
          />
          {errors.nama_lengkap && (
            <p className="text-xs text-destructive">{errors.nama_lengkap}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="role">Role</Label>
          <Select
            value={values.role}
            onValueChange={(v) => v && set("role", v as UserRole)}
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Petugas">Petugas</SelectItem>
              <SelectItem value="Peminjam">Peminjam</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role}</p>
          )}
        </div>
      </form>

      <DrawerFooter>
        <Button type="submit" form="user-form">
          Simpan Perubahan
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </DrawerFooter>
    </>
  );
}
