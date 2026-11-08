"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
  };
}) {
  const { isMobile } = useSidebar();
  const handleLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  const getInitials = (name?: string): string => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="aria-expanded:bg-muted">
          <Avatar className="size-8 rounded-lg grayscale">
            <AvatarFallback className="rounded-lg">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-foreground/70">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={handleLogout}
          size="lg"
          className="flex justify-center border-2 bg-white"
        >
          <LogOutIcon />
          Log out
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
