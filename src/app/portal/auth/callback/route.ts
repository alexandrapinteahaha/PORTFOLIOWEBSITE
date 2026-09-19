import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Dedicated auth callback for portal magic links.
 * Always redirects to /portal/dashboard after session exchange.
 * No query params needed — avoids Supabase stripping ?next= from emailRedirectTo.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code       = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type       = url.searchParams.get("type") as "magiclink" | "email" | null;

  const supabase = await createSupabaseServerClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type });
  }

  return NextResponse.redirect(new URL("/portal/dashboard", url.origin));
}
