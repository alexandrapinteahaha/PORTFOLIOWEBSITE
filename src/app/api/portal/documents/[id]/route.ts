import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/portal/documents/[id]
 *
 * Generates a short-lived (5-minute) signed URL for a commission document.
 *
 * Security:
 * 1. User must be authenticated.
 * 2. User must have a portal_clients record linked to their auth UID.
 * 3. The document must belong to a commission owned by that client.
 * 4. The document must be is_client_visible = true.
 * 5. admin_notes are never returned.
 *
 * Signed URL expiry: 300 seconds (5 minutes).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: docId } = await params;

  // ── 1. Authenticate ──────────────────────────────────────────────────────
  const supabaseServer = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // ── 2. Look up the portal client for this auth user ──────────────────────
  const supabase = createSupabaseAdminClient();

  const { data: portalClient } = await supabase
    .from("portal_clients")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!portalClient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── 3. Fetch the document and verify full ownership chain ─────────────────
  //    document → commission → client (must match this portal client)
  //    Must also be is_client_visible = true.
  const { data: doc } = await supabase
    .from("commission_documents")
    .select("id, storage_path, commission_id, is_client_visible")
    .eq("id", docId)
    .eq("is_client_visible", true) // enforced here AND at RLS level
    .single();

  if (!doc) {
    // Do not distinguish "document not found" from "document not yours" — same 404
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Verify the commission belongs to this client
  const { data: commission } = await supabase
    .from("commissions")
    .select("id, client_id")
    .eq("id", doc.commission_id)
    .eq("client_id", portalClient.id) // ownership check
    .single();

  if (!commission) {
    // Ownership mismatch — return 404 (not 403) to avoid leaking that the doc exists
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ── 4. Generate a 5-minute signed URL from the private bucket ────────────
  const { data: signed, error: signError } = await supabase.storage
    .from("commission-documents")
    .createSignedUrl(doc.storage_path, 300); // 300 seconds = 5 minutes

  if (signError || !signed?.signedUrl) {
    console.error("[portal/documents] signed URL error:", signError);
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl });
}
