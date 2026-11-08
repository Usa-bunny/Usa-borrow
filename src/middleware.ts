import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // const pathName = request.nextUrl.pathname;

  // const isAuthPage = pathName === "/login";
  // const isPublicPage = pathName === "/";

  // if (!user && !isAuthPage && !isPublicPage) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  // let role: string | null = null;
  // if (user) {
  //   const { data: profile } = await supabase
  //     .from("users")
  //     .select("role")
  //     .eq("id", user.id)
  //     .single();
  //   role = profile?.role || null;
  // }

  // if (user && isAuthPage) {
  //   const url = request.nextUrl.clone();
  //   if (role === "Admin") url.pathname = "/admin";
  //   else if (role === "Petugas") url.pathname = "/petugas";
  //   else url.pathname = "/peminjam";

  //   return NextResponse.redirect(url);
  // }

  // if (user) {
  //   const url = request.nextUrl.clone();
  //   if (
  //     role === "Peminjam" &&
  //     (pathName.startsWith("/admin") || pathName.startsWith("/petugas"))
  //   ) {
  //     url.pathname = "/peminjam";
  //     return NextResponse.redirect(url);
  //   }

  //   if (role === "Petugas" && pathName.startsWith("/admin")){
  //     url.pathname = "/petugas";
  //     return NextResponse.redirect(url);
  //   }
  // }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};