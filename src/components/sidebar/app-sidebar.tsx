"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CommandIcon } from "lucide-react";
import { getSidebarMenu } from "@/config/sidebar";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const profile = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      return profile?.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const data = {
    user: {
      name: profile?.nama_lengkap,
      email: profile?.email,
    },
    navMain: getSidebarMenu(profile?.role),
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">
                Aplikasi Peminjaman Alat
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
