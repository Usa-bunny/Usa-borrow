import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      db: { schema: "peminjaman_alat" },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathName = request.nextUrl.pathname;

  const isAuthPage = pathName === "/login" || pathName === "/signup";
  const isPublicPage = pathName === "/";

  if (!user && !isAuthPage && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      if (isPublicPage) return supabaseResponse;

      const url = request.nextUrl.clone();
      url.pathname = "/login";
      const res = NextResponse.redirect(url);

      const projectRef =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1];
      if (projectRef) {
        res.cookies.delete(`sb-${projectRef}-auth-token`);
      }
      return res;
    }

    const userRoleLower = profile.role.toLowerCase();

    if (isAuthPage || isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = `/${userRoleLower}`;
      return NextResponse.redirect(url);
    }

    const targetRoleRoute = ["/admin", "/petugas", "/peminjam"].find((route) =>
      pathName.startsWith(route),
    );

    if (targetRoleRoute && targetRoleRoute !== `/${userRoleLower}`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${userRoleLower}`;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
