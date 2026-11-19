import {
  CheckSquare,
  ClipboardList,
  Eye,
  File,
  FilePlus,
  HardDrive,
  History,
  LucideIcon,
  RefreshCcw,
  RefreshCw,
  Tags,
  Users,
} from "lucide-react";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const adminMenu: NavItem[] = [
  { title: "Manage User", url: "/admin/users", icon: Users },
  { title: "Manage Alat", url: "/admin/alat", icon: HardDrive },
  { title: "Manage Kategori", url: "/admin/kategori", icon: Tags },
  { title: "Peminjaman", url: "/admin/peminjaman", icon: ClipboardList },
  { title: "Pengembalian", url: "/admin/pengembalian", icon: RefreshCw },
  { title: "Log Aktivitas", url: "/admin/logs", icon: History },
];

const petugasMenu: NavItem[] = [
  {
    title: "Persetujuan Peminjaman",
    url: "/petugas/persetujuan-peminjaman",
    icon: CheckSquare,
  },
  {
    title: "Pantau Pengembalian",
    url: "/petugas/pantau-pengembalian",
    icon: RefreshCw,
  },
  // {
  //   title: "Laporan",
  //   url: "/petugas/laporan",
  //   icon: File,
  // },
];

const peminjamMenu: NavItem[] = [
  { title: "Daftar Alat", url: "/peminjam/daftar-alat", icon: Eye },
  {
    title: "Mengajukan Peminjaman",
    url: "/peminjam/ajukan-peminjaman",
    icon: FilePlus,
  },
  {
    title: "Melacak Pengembalian",
    url: "/peminjam/lacak-pengembalian",
    icon: RefreshCcw,
  },
];

export function getSidebarMenu(role: string): NavItem[] {
  switch (role) {
    case "Admin":
      return adminMenu;
    case "Petugas":
      return petugasMenu;
    case "Peminjam":
      return peminjamMenu;
    default:
      return [];
  }
}
