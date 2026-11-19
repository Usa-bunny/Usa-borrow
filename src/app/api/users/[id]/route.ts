import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // 1. Verifikasi caller adalah Admin (via cookie session)
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: me } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (me?.role !== "Admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. Admin client (service role) untuk hapus
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // 3. Hapus public.users dulu (karena FK RESTRICT), lalu auth.users
  const { error: publicErr } = await admin.from("users").delete().eq("id", id);
  if (publicErr) {
    return new NextResponse(publicErr.message, { status: 500 });
  }

  const { error: authErr } = await admin.auth.admin.deleteUser(id);
  if (authErr) {
    return new NextResponse(authErr.message, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}