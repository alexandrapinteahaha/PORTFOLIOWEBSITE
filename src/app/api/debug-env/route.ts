import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return NextResponse.json({
    url_set: url.length > 0,
    url_preview: url ? url.slice(0, 30) + "..." : "empty",
    key_set: key.length > 0,
    key_preview: key ? key.slice(0, 20) + "..." : "empty",
    svc_set: svc.length > 0,
  });
}
