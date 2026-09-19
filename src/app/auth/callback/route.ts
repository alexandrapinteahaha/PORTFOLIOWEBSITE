import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code         = url.searchParams.get("code");
  const token_hash   = url.searchParams.get("token_hash");
  const type         = url.searchParams.get("type") as "magiclink" | "email" | null;
  const next         = url.searchParams.get("next") ?? "/portal/dashboard";

  const supabase = await createSupabaseServerClient();

  if (code) {
    // PKCE flow (OAuth, email link with code exchange)
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    // OTP / magic link flow (token hash in URL)
    await supabase.auth.verifyOtp({ token_hash, type });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
