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
import { getSidebarMenu } from "@/config/sidebar";
import { Separator } from "../ui/separator";
import { createClient } from "@/utils/supabase/client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Gunakan useMemo agar supabase client tidak dibuat ulang terus menerus
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        if (isMounted) {
          setProfile(null);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (isMounted) {
        if (!error && data) {
          setProfile(data);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    };

    // 1. Ambil profil saat pertama kali komponen dimuat
    fetchProfile();

    // 2. Dengarkan perubahan status Auth (Login / Logout / Ganti Akun)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        fetchProfile();
      }
    });

    // 3. Bersihkan listener saat komponen di-unmount
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const sidebarMenu = profile?.role ? getSidebarMenu(profile.role) : [];

  const data = {
    user: {
      name: profile?.nama_lengkap || "Memuat...",
      email: profile?.email || "",
    },
    navMain: sidebarMenu,
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
              <img src="/logo.png" alt="logo" className="w-6" />
              <span className="text-base font-semibold">Usa Borrow</span>
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