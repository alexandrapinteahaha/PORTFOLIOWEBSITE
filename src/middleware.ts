import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // When Supabase falls back to the Site URL, the PKCE code (or token_hash)
  // lands on the homepage as a query param. Catch it here and forward to the
  // callback route, which handles the session exchange.
  if (pathname === "/") {
    const code       = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type       = searchParams.get("type");
    if (code || (token_hash && type)) {
      const cb = new URL("/auth/callback", request.url);
      if (code)       cb.searchParams.set("code", code);
      if (token_hash) cb.searchParams.set("token_hash", token_hash);
      if (type)       cb.searchParams.set("type", type);
      return NextResponse.redirect(cb);
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, skip Supabase and pass through
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options ?? {})
          );
        }
      }
    });

    await supabase.auth.getUser();
  } catch {
    // Don't let a Supabase error take down the whole site
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
