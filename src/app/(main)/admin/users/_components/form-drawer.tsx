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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { documentSchema, type Document } from "./schema";

export type DocumentInput = Omit<Document, "id">;

const TYPES = [
  "Table of Contents",
  "Executive Summary",
  "Technical Approach",
  "Design",
  "Capabilities",
  "Focus Documents",
  "Narrative",
  "Cover Page",
];
const STATUSES = ["Done", "In Progress", "Not Started"];
const REVIEWERS = ["Eddie Lake", "Jamik Tashpulatov", "Emily Whalen"];

const EMPTY: DocumentInput = {
  header: "",
  type: TYPES[0],
  status: "Not Started",
  target: "",
  limit: "",
  reviewer: "Assign reviewer",
};

const inputSchema = documentSchema.omit({ id: true }).extend({
  header: documentSchema.shape.header.min(1, "Header wajib diisi"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onSubmit: (values: DocumentInput) => void;
}

export function DocumentFormDrawer({
  open,
  onOpenChange,
  document,
  onSubmit,
}: Props) {
  const isEdit = !!document;
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
            {isEdit ? "Edit Section" : "Tambah Section"}
          </DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? "Ubah data section lalu simpan."
              : "Isi data untuk section baru."}
          </DrawerDescription>
        </DrawerHeader>

        <DocumentForm
          document={document}
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

function DocumentForm({
  document,
  onSubmit,
  onCancel,
  isEdit,
}: {
  document: Document | null;
  onSubmit: (values: DocumentInput) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [values, setValues] = React.useState<DocumentInput>(
    document
      ? {
          header: document.header,
          type: document.type,
          status: document.status,
          target: document.target,
          limit: document.limit,
          reviewer: document.reviewer,
        }
      : EMPTY,
  );
  const [error, setError] = React.useState<string | null>(null);

  const set = <K extends keyof DocumentInput>(
    key: K,
    value: DocumentInput[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = inputSchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    onSubmit(result.data);
  }

  return (
    <>
      <form
        id="document-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="header">Header</Label>
          <Input
            id="header"
            value={values.header}
            onChange={(e) => set("header", e.target.value)}
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="type">Type</Label>
            <Select
              value={values.type}
              onValueChange={(v) => v && set("type", v)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Pilih type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="status">Status</Label>
            <Select
              value={values.status}
              onValueChange={(v) => v && set("status", v)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              value={values.target}
              onChange={(e) => set("target", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="limit">Limit</Label>
            <Input
              id="limit"
              value={values.limit}
              onChange={(e) => set("limit", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="reviewer">Reviewer</Label>
          <Select
            value={values.reviewer}
            onValueChange={(v) => v && set("reviewer", v)}
          >
            <SelectTrigger id="reviewer" className="w-full">
              <SelectValue placeholder="Pilih reviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assign reviewer">
                Belum ada reviewer
              </SelectItem>
              {REVIEWERS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      <DrawerFooter>
        <Button type="submit" form="document-form">
          {isEdit ? "Simpan Perubahan" : "Tambah"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </DrawerFooter>
    </>
  );
}
