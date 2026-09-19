"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/stripe";
import {
  TIMELINE_STAGES,
  sanitiseStorageFilename,
  validateUpload,
} from "@/lib/portal";

// ─── Storage helpers ──────────────────────────────────────────────────────────

const BUCKET = "commission-documents";

async function ensureCommissionBucket(
  supabase: ReturnType<typeof createSupabaseAdminClient>
) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: false });
  }
}

// ─── Reference generation ─────────────────────────────────────────────────────

async function generateRef(
  supabase: ReturnType<typeof createSupabaseAdminClient>
): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("commissions")
    .select("id", { count: "exact", head: true })
    .like("reference", `AP-${year}-%`);
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  return `AP-${year}-${seq}`;
}

// ─── Portal clients ───────────────────────────────────────────────────────────

export async function createPortalClient(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const name  = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name || !email) return;

  await supabase.from("portal_clients").insert({ name, email, phone });
  await supabase.from("audit_logs").insert({
    event_type: "client_created",
    actor_type: "admin",
    metadata: { name, email },
  });

  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

// ─── Delete portal client ─────────────────────────────────────────────────────

export async function deletePortalClient(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const clientId = String(formData.get("client_id") ?? "");
  if (!clientId) return;

  // Only allow deletion if client has no commissions
  const { count } = await supabase
    .from("commissions")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId);

  if (count && count > 0) {
    // Cannot delete client with active commissions — redirect with error
    revalidatePath("/admin/clients");
    redirect("/admin/clients?error=has_commissions");
  }

  await supabase.from("portal_clients").delete().eq("id", clientId);

  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

// ─── Commission creation ──────────────────────────────────────────────────────

export async function createCommission(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const clientId   = String(formData.get("client_id") ?? "");
  const enquiryId  = String(formData.get("enquiry_id") ?? "") || null;
  const title      = String(formData.get("artwork_title") ?? "").trim();
  const ref        = await generateRef(supabase);

  if (!clientId || !title) return;

  // Insert commission
  const { data: commission, error } = await supabase
    .from("commissions")
    .insert({
      reference:            ref,
      client_id:            clientId,
      enquiry_id:           enquiryId,
      artwork_title:        title,
      description:          String(formData.get("description") ?? "") || null,
      medium:               String(formData.get("medium") ?? "") || null,
      dimensions:           String(formData.get("dimensions") ?? "") || null,
      agreed_price_gbp:     formData.get("agreed_price_gbp") ? Number(formData.get("agreed_price_gbp")) : null,
      deposit_amount_gbp:   formData.get("deposit_amount_gbp") ? Number(formData.get("deposit_amount_gbp")) : null,
      currency:             "gbp",
      status:               "agreement_pending",
      estimated_completion: String(formData.get("estimated_completion") ?? "") || null,
      admin_notes:          String(formData.get("admin_notes") ?? "") || null,
    })
    .select("id")
    .single();

  if (error || !commission) return;

  // Link enquiry → commission
  if (enquiryId) {
    await supabase
      .from("commission_enquiries")
      .update({ commission_id: commission.id })
      .eq("id", enquiryId);
  }

  // Create default timeline
  await supabase.from("commission_timeline").insert(
    TIMELINE_STAGES.map((s) => ({
      commission_id: commission.id,
      stage:         s.stage,
      stage_order:   s.order,
      status:        s.order === 1 ? "completed" : "upcoming",
      completed_at:  s.order === 1 ? new Date().toISOString() : null,
    }))
  );

  // Audit log
  await supabase.from("audit_logs").insert({
    event_type:    "commission_created",
    actor_type:    "admin",
    commission_id: commission.id,
    client_id:     clientId,
    metadata:      { reference: ref, title },
  });

  revalidatePath("/admin/commissions");
  redirect(`/admin/commissions/${commission.id}`);
}

// ─── Commission update ────────────────────────────────────────────────────────

export async function updateCommissionDetails(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("commissions")
    .update({
      artwork_title:        String(formData.get("artwork_title") ?? ""),
      description:          String(formData.get("description") ?? "") || null,
      medium:               String(formData.get("medium") ?? "") || null,
      dimensions:           String(formData.get("dimensions") ?? "") || null,
      agreed_price_gbp:     formData.get("agreed_price_gbp") ? Number(formData.get("agreed_price_gbp")) : null,
      deposit_amount_gbp:   formData.get("deposit_amount_gbp") ? Number(formData.get("deposit_amount_gbp")) : null,
      estimated_completion: String(formData.get("estimated_completion") ?? "") || null,
      admin_notes:          String(formData.get("admin_notes") ?? "") || null,
      updated_at:           new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/admin/commissions/${id}`);
}

export async function updateCommissionStatus(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id     = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  await supabase
    .from("commissions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  await supabase.from("audit_logs").insert({
    event_type:    "status_changed",
    actor_type:    "admin",
    commission_id: id,
    metadata:      { new_status: status },
  });

  revalidatePath(`/admin/commissions/${id}`);
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function updateTimelineStage(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id          = String(formData.get("timeline_id") ?? "");
  const stageStatus = String(formData.get("status") ?? "");
  const clientNote  = String(formData.get("client_note") ?? "") || null;
  const adminNote   = String(formData.get("admin_note") ?? "") || null;
  const commissionId = String(formData.get("commission_id") ?? "");

  await supabase
    .from("commission_timeline")
    .update({
      status:       stageStatus,
      completed_at: stageStatus === "completed" ? new Date().toISOString() : null,
      client_note:  clientNote,
      admin_note:   adminNote,
    })
    .eq("id", id);

  revalidatePath(`/admin/commissions/${commissionId}`);
}

// ─── Updates (client-visible messages) ───────────────────────────────────────

export async function postCommissionUpdate(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const title        = String(formData.get("title") ?? "") || null;
  const body         = String(formData.get("body") ?? "").trim();
  const visible      = formData.get("is_client_visible") !== "false";

  if (!commissionId || !body) return;

  await supabase.from("commission_updates").insert({
    commission_id:     commissionId,
    title,
    body,
    is_client_visible: visible,
  });

  await supabase.from("audit_logs").insert({
    event_type:    "commission_updated",
    actor_type:    "admin",
    commission_id: commissionId,
    metadata:      { visible },
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function uploadCommissionDocument(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await ensureCommissionBucket(supabase);

  const commissionId   = String(formData.get("commission_id") ?? "");
  const documentType   = String(formData.get("document_type") ?? "other");
  const label          = String(formData.get("label") ?? "").trim();
  const isVisible      = formData.get("is_client_visible") !== "false";
  const file           = formData.get("file") as File;

  if (!commissionId || !label || !file?.size) return;

  const uploadError = validateUpload(file);
  if (uploadError) return;

  // Generate a document ID first so we can use it in the storage path
  const docId   = crypto.randomUUID();
  const safeName = sanitiseStorageFilename(file.name, docId);
  const path     = `${commissionId}/${docId}/${safeName}`;

  const { error: storageErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (storageErr) return;

  await supabase.from("commission_documents").insert({
    id:                docId,
    commission_id:     commissionId,
    document_type:     documentType,
    label,
    storage_path:      path,
    file_size_bytes:   file.size,
    mime_type:         file.type,
    is_client_visible: isVisible,
  });

  await supabase.from("audit_logs").insert({
    event_type:    "document_uploaded",
    actor_type:    "admin",
    commission_id: commissionId,
    document_id:   docId,
    metadata:      { label, type: documentType, visible: isVisible },
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
}

export async function deleteCommissionDocument(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const docId        = String(formData.get("doc_id") ?? "");
  const commissionId = String(formData.get("commission_id") ?? "");

  const { data: doc } = await supabase
    .from("commission_documents")
    .select("storage_path")
    .eq("id", docId)
    .eq("commission_id", commissionId)
    .single();

  if (doc) {
    await supabase.storage.from(BUCKET).remove([doc.storage_path]);
    await supabase.from("commission_documents").delete().eq("id", docId);
  }

  revalidatePath(`/admin/commissions/${commissionId}`);
}

// ─── Concept versions ─────────────────────────────────────────────────────────

export async function uploadConceptVersion(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await ensureCommissionBucket(supabase);

  const commissionId = String(formData.get("commission_id") ?? "");
  const notes        = String(formData.get("notes") ?? "") || null;
  const adminNotes   = String(formData.get("admin_notes") ?? "") || null;
  const file         = formData.get("file") as File;

  if (!commissionId || !file?.size) return;

  const uploadError = validateUpload(file);
  if (uploadError) return;

  // Get next version number
  const { count } = await supabase
    .from("concept_versions")
    .select("id", { count: "exact", head: true })
    .eq("commission_id", commissionId);

  const versionNumber = (count ?? 0) + 1;
  const versionId     = crypto.randomUUID();
  const safeName      = sanitiseStorageFilename(file.name, versionId);
  const path          = `${commissionId}/concepts/${versionId}/${safeName}`;

  const { error: storageErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (storageErr) return;

  // Mark all previous versions as superseded
  await supabase
    .from("concept_versions")
    .update({ status: "superseded" })
    .eq("commission_id", commissionId)
    .eq("status", "pending");

  await supabase.from("concept_versions").insert({
    id:             versionId,
    commission_id:  commissionId,
    version_number: versionNumber,
    label:          `Concept v${versionNumber}`,
    storage_path:   path,
    notes,
    admin_notes:    adminNotes,
    status:         "pending",
  });

  // Advance commission to concept_review
  await supabase
    .from("commissions")
    .update({ status: "concept_review", updated_at: new Date().toISOString() })
    .eq("id", commissionId);

  await supabase.from("audit_logs").insert({
    event_type:    "concept_uploaded",
    actor_type:    "admin",
    commission_id: commissionId,
    document_id:   versionId,
    metadata:      { version: versionNumber },
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function createCommissionPaymentRecord(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const commissionId  = String(formData.get("commission_id") ?? "");
  const clientId      = String(formData.get("client_id") ?? "");
  const paymentType   = String(formData.get("payment_type") ?? "deposit");
  const amountGbp     = Number(formData.get("amount_gbp") ?? 0);

  if (!commissionId || !clientId || !amountGbp) return;

  await supabase.from("commission_payments").insert({
    commission_id: commissionId,
    client_id:     clientId,
    payment_type:  paymentType,
    amount_gbp:    amountGbp,
    currency:      "gbp",
    status:        "pending",
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export async function upsertCommissionShipping(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");

  const payload = {
    commission_id:      commissionId,
    carrier:            String(formData.get("carrier") ?? "") || null,
    tracking_number:    String(formData.get("tracking_number") ?? "") || null,
    tracking_url:       String(formData.get("tracking_url") ?? "") || null,
    estimated_delivery: String(formData.get("estimated_delivery") ?? "") || null,
    shipped_at:         String(formData.get("shipped_at") ?? "") || null,
    delivered_at:       String(formData.get("delivered_at") ?? "") || null,
    client_note:        String(formData.get("client_note") ?? "") || null,
    updated_at:         new Date().toISOString(),
  };

  await supabase
    .from("commission_shipping")
    .upsert(payload, { onConflict: "commission_id" });

  if (payload.shipped_at) {
    await supabase
      .from("commissions")
      .update({ status: "shipping", updated_at: new Date().toISOString() })
      .eq("id", commissionId)
      .in("status", ["completed", "final_payment_paid", "delivered"]);
  }

  await supabase.from("audit_logs").insert({
    event_type:    "shipping_updated",
    actor_type:    "admin",
    commission_id: commissionId,
    metadata:      { tracking: payload.tracking_number },
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
}

// ─── Portal invitation email ──────────────────────────────────────────────────

export async function sendPortalInvitation(formData: FormData) {
  await requireAdmin();
  const supabase  = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const clientId     = String(formData.get("client_id") ?? "");
  const siteUrl      = getSiteUrl();

  const { data: client } = await supabase
    .from("portal_clients")
    .select("name, email")
    .eq("id", clientId)
    .single();

  if (!client) return;

  const { data: commission } = await supabase
    .from("commissions")
    .select("reference, artwork_title")
    .eq("id", commissionId)
    .single();

  if (!commission) return;

  // Send magic link via Supabase (handles email delivery automatically)
  // Falls back to Resend if API key is configured (for branded email)
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    // Branded email via Resend — generate link then send ourselves
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: client.email,
      options: {
        redirectTo: `${siteUrl}/portal/auth/callback`,
      },
    });

    const magicLink = linkData?.properties?.action_link;
    if (magicLink) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Alexandra Pintea <noreply@alexandrapintea.art>",
        to:   client.email,
        subject: "Your commission portal is ready",
        text: `Hi ${client.name},

Your private commission portal is ready.

I've created a secure space where you can follow the progress of your commission, review documents, approve concepts and manage payments.

Access your portal:
${magicLink}

This link will expire after 1 hour. You can always request a new one at ${siteUrl}/portal

Your commission: ${commission.artwork_title} (${commission.reference})

Alexandra Pintea
alexandrapintea.art`,
      });
    }
  } else {
    // No Resend key — use Supabase's built-in email delivery
    // Supabase sends the magic link email automatically via signInWithOtp
    await supabase.auth.signInWithOtp({
      email: client.email,
      options: {
        shouldCreateUser: true, // creates auth user on first invitation
        emailRedirectTo: `${siteUrl}/portal/auth/callback`,
      },
    });
  }

  // Record invitation sent
  await supabase
    .from("commissions")
    .update({ invitation_sent_at: new Date().toISOString() })
    .eq("id", commissionId);

  await supabase.from("audit_logs").insert({
    event_type:    "invitation_sent",
    actor_type:    "admin",
    commission_id: commissionId,
    client_id:     clientId,
    metadata:      { email: client.email },
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
}
