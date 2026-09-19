"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePortalClient } from "@/lib/access";

/**
 * Magic link request for the commission portal.
 * Always returns a generic success message — never reveals whether an email
 * exists in the system (prevents account enumeration).
 */
export async function requestPortalMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  if (!email) redirect("/portal?error=invalid");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        shouldCreateUser: true, // creates auth user if needed; access check happens at dashboard
      },
    });
  } catch {
    // Swallow errors — never reveal whether the email exists
  }

  redirect("/portal?sent=true");
}

/**
 * Sign the current portal user out and return them to the portal login page.
 */
export async function signOutPortal() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/portal");
}

/**
 * Client approves a concept version.
 * Verifies full ownership chain server-side; cannot approve another client's concept.
 */
export async function approveConceptVersion(formData: FormData) {
  const { user, client } = await requirePortalClient();
  const conceptVersionId = String(formData.get("concept_version_id") ?? "");
  const commissionId     = String(formData.get("commission_id") ?? "");
  const ref              = String(formData.get("commission_ref") ?? "");

  if (!conceptVersionId || !commissionId) redirect(`/portal/commission/${ref}`);

  const supabase = createSupabaseAdminClient();

  // Verify the concept version belongs to a commission belonging to this client
  const { data: version } = await supabase
    .from("concept_versions")
    .select("id, commission_id, status")
    .eq("id", conceptVersionId)
    .eq("commission_id", commissionId)
    .single();

  if (!version) redirect(`/portal/commission/${ref}`);

  // Verify commission belongs to this client
  const { data: commission } = await supabase
    .from("commissions")
    .select("id, client_id")
    .eq("id", commissionId)
    .eq("client_id", client.id)
    .single();

  if (!commission) redirect(`/portal/commission/${ref}`);

  // Mark all other versions of this commission as superseded
  await supabase
    .from("concept_versions")
    .update({ status: "superseded" })
    .eq("commission_id", commissionId)
    .neq("id", conceptVersionId);

  // Mark this version as approved
  await supabase
    .from("concept_versions")
    .update({ status: "approved" })
    .eq("id", conceptVersionId);

  // Insert immutable approval record
  await supabase.from("concept_approvals").insert({
    concept_version_id: conceptVersionId,
    commission_id: commissionId,
    client_id: client.id,
    auth_user_id: user.id,
    action: "approved",
    changes_note: null,
  });

  // Advance commission status
  await supabase
    .from("commissions")
    .update({ status: "concept_approved", updated_at: new Date().toISOString() })
    .eq("id", commissionId);

  // Audit log
  await supabase.from("audit_logs").insert({
    event_type: "concept_approved",
    actor_type: "client",
    actor_id: user.id,
    commission_id: commissionId,
    client_id: client.id,
    document_id: conceptVersionId,
    metadata: { version_id: conceptVersionId },
  });

  revalidatePath(`/portal/commission/${ref}`);
  redirect(`/portal/commission/${ref}?approved=true`);
}

/**
 * Client requests changes to a concept version.
 * Verifies full ownership chain server-side.
 */
export async function requestConceptChanges(formData: FormData) {
  const { user, client } = await requirePortalClient();
  const conceptVersionId = String(formData.get("concept_version_id") ?? "");
  const commissionId     = String(formData.get("commission_id") ?? "");
  const ref              = String(formData.get("commission_ref") ?? "");
  const changesNote      = String(formData.get("changes_note") ?? "").trim();

  if (!conceptVersionId || !commissionId) redirect(`/portal/commission/${ref}`);

  const supabase = createSupabaseAdminClient();

  // Verify ownership chain
  const { data: commission } = await supabase
    .from("commissions")
    .select("id, client_id")
    .eq("id", commissionId)
    .eq("client_id", client.id)
    .single();

  if (!commission) redirect(`/portal/commission/${ref}`);

  const { data: version } = await supabase
    .from("concept_versions")
    .select("id")
    .eq("id", conceptVersionId)
    .eq("commission_id", commissionId)
    .single();

  if (!version) redirect(`/portal/commission/${ref}`);

  // Mark this version as changes_requested
  await supabase
    .from("concept_versions")
    .update({ status: "changes_requested" })
    .eq("id", conceptVersionId);

  // Insert immutable approval record
  await supabase.from("concept_approvals").insert({
    concept_version_id: conceptVersionId,
    commission_id: commissionId,
    client_id: client.id,
    auth_user_id: user.id,
    action: "changes_requested",
    changes_note: changesNote || null,
  });

  // Revert commission status to concept stage
  await supabase
    .from("commissions")
    .update({ status: "concept", updated_at: new Date().toISOString() })
    .eq("id", commissionId);

  // Audit log
  await supabase.from("audit_logs").insert({
    event_type: "concept_changes_requested",
    actor_type: "client",
    actor_id: user.id,
    commission_id: commissionId,
    client_id: client.id,
    document_id: conceptVersionId,
    metadata: { version_id: conceptVersionId, note: changesNote || null },
  });

  revalidatePath(`/portal/commission/${ref}`);
  redirect(`/portal/commission/${ref}?changes=true`);
}
