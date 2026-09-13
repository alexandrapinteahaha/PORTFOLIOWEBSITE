import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  updateCommissionDetails,
  updateCommissionStatus,
  updateTimelineStage,
  postCommissionUpdate,
  uploadCommissionDocument,
  deleteCommissionDocument,
  uploadConceptVersion,
  createCommissionPaymentRecord,
  upsertCommissionShipping,
  sendPortalInvitation,
} from "@/app/admin/portal-actions";
import {
  COMMISSION_STATUSES,
  COMMISSION_STATUS_LABELS,
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  TIMELINE_STAGES,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/portal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("commissions")
    .select("reference, artwork_title")
    .eq("id", id)
    .single();
  return { title: data ? `${data.reference} — ${data.artwork_title}` : "Commission" };
}

export default async function AdminCommissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch commission first so we have client_id for subsequent queries
  const { data: commission } = await supabase
    .from("commissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!commission) notFound();

  const [
    { data: portalClientRow },
    { data: timeline },
    { data: updates },
    { data: documents },
    { data: concepts },
    { data: payments },
    { data: shipping },
    { data: approvals },
  ] = await Promise.all([
    supabase
      .from("portal_clients")
      .select("id, name, email, auth_user_id")
      .eq("id", commission.client_id)
      .single(),
    supabase
      .from("commission_timeline")
      .select("*")
      .eq("commission_id", id)
      .order("stage_order"),
    supabase
      .from("commission_updates")
      .select("*")
      .eq("commission_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("commission_documents")
      .select("*")
      .eq("commission_id", id)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("concept_versions")
      .select("*")
      .eq("commission_id", id)
      .order("version_number", { ascending: false }),
    supabase
      .from("commission_payments")
      .select("*")
      .eq("commission_id", id),
    supabase
      .from("commission_shipping")
      .select("*")
      .eq("commission_id", id)
      .single(),
    supabase
      .from("concept_approvals")
      .select("*, concept_versions(version_number, label)")
      .eq("commission_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const portalClient = portalClientRow;

  const inputCls = "w-full border border-line bg-white px-3 py-2 text-xs focus:border-ink focus:outline-none";
  const textareaCls = `${inputCls} resize-y`;

  return (
    <section className="container-shell py-14">
      <AdminNav />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/commissions" className="text-xs text-graphite underline underline-offset-4 hover:text-ink">
            ← All commissions
          </a>
          <h1 className="mt-2 font-title text-3xl font-bold">{commission.artwork_title}</h1>
          <p className="mt-1 text-sm text-graphite">
            {commission.reference}
            {portalClient && ` · ${portalClient.name} (${portalClient.email})`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-block border border-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
            {COMMISSION_STATUS_LABELS[commission.status] ?? commission.status}
          </span>
          {commission.invitation_sent_at && (
            <span className="inline-block border border-green-400 px-3 py-1 text-xs text-green-700">
              Portal invitation sent {formatDate(commission.invitation_sent_at)}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-8">

          {/* ── Status ────────────────────────────────────────────────────── */}
          <AdminSection title="Status">
            <form action={updateCommissionStatus} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={id} />
              <Label text="Commission status">
                <select name="status" defaultValue={commission.status} className={inputCls}>
                  {COMMISSION_STATUSES.map((s) => (
                    <option key={s} value={s}>{COMMISSION_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </Label>
              <SaveBtn />
            </form>
          </AdminSection>

          {/* ── Commission details ─────────────────────────────────────────── */}
          <AdminSection title="Details">
            <form action={updateCommissionDetails} className="grid gap-4">
              <input type="hidden" name="id" value={id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Label text="Artwork title *">
                  <input type="text" name="artwork_title" defaultValue={commission.artwork_title} required className={inputCls} />
                </Label>
                <Label text="Medium">
                  <input type="text" name="medium" defaultValue={commission.medium ?? ""} className={inputCls} />
                </Label>
                <Label text="Dimensions">
                  <input type="text" name="dimensions" defaultValue={commission.dimensions ?? ""} className={inputCls} />
                </Label>
                <Label text="Estimated completion">
                  <input type="date" name="estimated_completion" defaultValue={commission.estimated_completion ?? ""} className={inputCls} />
                </Label>
                <Label text="Agreed price (£)">
                  <input type="number" step="0.01" name="agreed_price_gbp" defaultValue={commission.agreed_price_gbp ?? ""} className={inputCls} />
                </Label>
                <Label text="Deposit amount (£)">
                  <input type="number" step="0.01" name="deposit_amount_gbp" defaultValue={commission.deposit_amount_gbp ?? ""} className={inputCls} />
                </Label>
              </div>
              <Label text="Description (client-visible)">
                <textarea name="description" rows={3} defaultValue={commission.description ?? ""} className={textareaCls} />
              </Label>
              <Label text="Admin notes (private — never shown to client)">
                <textarea name="admin_notes" rows={3} defaultValue={commission.admin_notes ?? ""} className={`${textareaCls} bg-amber-50`} />
              </Label>
              <SaveBtn />
            </form>
          </AdminSection>

          {/* ── Timeline ──────────────────────────────────────────────────── */}
          <AdminSection title="Timeline">
            <div className="grid gap-3">
              {(timeline ?? []).map((stage) => {
                const stageLabel = TIMELINE_STAGES.find(s => s.stage === stage.stage)?.label ?? stage.stage;
                return (
                  <details key={stage.id} className="border border-line">
                    <summary className="flex cursor-pointer items-center gap-3 bg-chalk px-4 py-3">
                      <span className={[
                        "shrink-0 text-xs font-bold uppercase tracking-[0.08em]",
                        stage.status === "completed" ? "text-green-700" :
                        stage.status === "active" ? "text-ink" : "text-graphite/40"
                      ].join(" ")}>
                        {stage.status === "completed" ? "✓" : stage.status === "active" ? "●" : "○"} {stageLabel}
                      </span>
                      {stage.completed_at && (
                        <span className="text-xs text-graphite">{formatDate(stage.completed_at)}</span>
                      )}
                    </summary>
                    <div className="p-4">
                      <form action={updateTimelineStage} className="grid gap-3">
                        <input type="hidden" name="timeline_id" value={stage.id} />
                        <input type="hidden" name="commission_id" value={id} />
                        <div className="grid gap-3 sm:grid-cols-3">
                          <Label text="Status">
                            <select name="status" defaultValue={stage.status} className={inputCls}>
                              <option value="upcoming">Upcoming</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                            </select>
                          </Label>
                          <Label text="Client note">
                            <input type="text" name="client_note" defaultValue={stage.client_note ?? ""} className={inputCls} />
                          </Label>
                          <Label text="Admin note (private)">
                            <input type="text" name="admin_note" defaultValue={stage.admin_note ?? ""} className={`${inputCls} bg-amber-50`} />
                          </Label>
                        </div>
                        <SaveBtn />
                      </form>
                    </div>
                  </details>
                );
              })}
            </div>
          </AdminSection>

          {/* ── Concept versions ──────────────────────────────────────────── */}
          <AdminSection title="Concepts">
            {(concepts ?? []).length > 0 && (
              <div className="mb-5 grid gap-3">
                {(concepts ?? []).map((concept) => {
                  const approval = (approvals ?? []).find(a => a.concept_version_id === concept.id);
                  return (
                    <div key={concept.id} className="flex items-start justify-between gap-4 border border-line p-4">
                      <div>
                        <p className="font-title text-sm font-bold">
                          {concept.label ?? `Concept v${concept.version_number}`}
                        </p>
                        <p className="mt-0.5 text-xs text-graphite">
                          Uploaded {formatDate(concept.created_at)}
                          {concept.notes && ` · ${concept.notes}`}
                        </p>
                        {approval && (
                          <p className={`mt-1 text-xs font-semibold ${approval.action === "approved" ? "text-green-700" : "text-amber-700"}`}>
                            {approval.action === "approved" ? "✓ Approved by client" : "⚠ Changes requested"}
                            {approval.changes_note && `: "${approval.changes_note}"`}
                            {" · "}{formatDateTime(approval.created_at)}
                          </p>
                        )}
                        {concept.admin_notes && (
                          <p className="mt-1 text-xs text-amber-700">Admin: {concept.admin_notes}</p>
                        )}
                      </div>
                      <span className={`shrink-0 border px-2 py-1 text-xs font-semibold ${
                        concept.status === "approved" ? "border-green-300 text-green-700" :
                        concept.status === "pending" ? "border-ink" :
                        concept.status === "changes_requested" ? "border-amber-400 text-amber-700" :
                        "border-line text-graphite/40"
                      }`}>
                        {concept.status.replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <form action={uploadConceptVersion} className="grid gap-4 border border-line p-4">
              <input type="hidden" name="commission_id" value={id} />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                Upload new concept
              </p>
              <Label text="Concept file (image or PDF)">
                <input type="file" name="file" required accept="image/*,application/pdf" className={inputCls} />
              </Label>
              <Label text="Notes for client">
                <textarea name="notes" rows={2} className={textareaCls} placeholder="Optional message shown to client alongside this concept…" />
              </Label>
              <Label text="Admin notes (private)">
                <textarea name="admin_notes" rows={2} className={`${textareaCls} bg-amber-50`} placeholder="Internal notes — never shown to client…" />
              </Label>
              <SaveBtn label="Upload concept" />
            </form>
          </AdminSection>

          {/* ── Post update ───────────────────────────────────────────────── */}
          <AdminSection title="Post Update">
            <form action={postCommissionUpdate} className="grid gap-4">
              <input type="hidden" name="commission_id" value={id} />
              <Label text="Title (optional)">
                <input type="text" name="title" className={inputCls} placeholder="e.g. Production update" />
              </Label>
              <Label text="Message *">
                <textarea name="body" rows={5} required className={textareaCls} placeholder="Write an update for the client…" />
              </Label>
              <label className="flex items-center gap-2 text-xs text-graphite cursor-pointer">
                <input type="hidden" name="is_client_visible" value="false" />
                <input type="checkbox" name="is_client_visible" value="true" defaultChecked className="accent-ink" />
                Visible to client
              </label>
              <SaveBtn label="Post update" />
            </form>
          </AdminSection>

          {/* ── Documents ─────────────────────────────────────────────────── */}
          <AdminSection title="Documents">
            {(documents ?? []).length > 0 && (
              <div className="mb-5 grid gap-2">
                {(documents ?? []).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 border border-line px-4 py-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{doc.label}</p>
                      <p className="mt-0.5 text-xs text-graphite">
                        {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                        {" · "}
                        {doc.is_client_visible ? (
                          <span className="text-green-700">Visible to client</span>
                        ) : (
                          <span className="text-amber-700">Admin only</span>
                        )}
                        {" · "}{formatDate(doc.uploaded_at)}
                      </p>
                    </div>
                    <form action={deleteCommissionDocument} className="shrink-0">
                      <input type="hidden" name="doc_id" value={doc.id} />
                      <input type="hidden" name="commission_id" value={id} />
                      <button type="submit" className="text-xs text-red-500 hover:text-red-700 underline">
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={uploadCommissionDocument} className="grid gap-4 border border-line p-4">
              <input type="hidden" name="commission_id" value={id} />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-graphite">Upload document</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Label text="Label (shown to client)">
                  <input type="text" name="label" required className={inputCls} placeholder="Commission Agreement" />
                </Label>
                <Label text="Document type">
                  <select name="document_type" className={inputCls}>
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </Label>
              </div>
              <Label text="File">
                <input type="file" name="file" required className={inputCls} />
              </Label>
              <label className="flex items-center gap-2 text-xs text-graphite cursor-pointer">
                <input type="checkbox" name="is_client_visible" value="true" defaultChecked className="accent-ink" />
                Visible to client (uncheck for admin-only documents)
              </label>
              <SaveBtn label="Upload document" />
            </form>
          </AdminSection>

        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className="grid gap-6 self-start">

          {/* Client + invitation */}
          {portalClient && (
            <AdminSection title="Client">
              <p className="font-title text-sm font-bold">{portalClient.name}</p>
              <p className="mt-0.5 text-xs text-graphite">{portalClient.email}</p>
              <p className="mt-1 text-xs text-graphite/60">
                Portal: {portalClient.auth_user_id ? "Activated" : "Not yet accessed"}
              </p>
              <div className="mt-4">
                <form action={sendPortalInvitation}>
                  <input type="hidden" name="commission_id" value={id} />
                  <input type="hidden" name="client_id" value={portalClient.id} />
                  <button
                    type="submit"
                    className="w-full border border-ink px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition hover:bg-ink hover:text-chalk"
                  >
                    {commission.invitation_sent_at ? "Resend invitation" : "Send portal invitation"}
                  </button>
                </form>
              </div>
              <p className="mt-2 text-xs text-graphite/50">
                Portal: <a href={`/portal`} target="_blank" className="underline">/portal</a>
              </p>
            </AdminSection>
          )}

          {/* Payments */}
          <AdminSection title="Payments">
            {(payments ?? []).length > 0 && (
              <div className="mb-4 grid gap-2">
                {(payments ?? []).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold capitalize">{p.payment_type.replace("_", " ")}</p>
                      <p className="text-xs text-graphite">{formatCurrency(p.amount_gbp)}</p>
                    </div>
                    <span className={`text-xs font-semibold ${p.status === "paid" ? "text-green-700" : "text-amber-600"}`}>
                      {p.status === "paid" ? "✓ Paid" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <form action={createCommissionPaymentRecord} className="grid gap-3 border-t border-line pt-4">
              <input type="hidden" name="commission_id" value={id} />
              <input type="hidden" name="client_id" value={commission.client_id} />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                Add payment record
              </p>
              <Label text="Type">
                <select name="payment_type" className={inputCls}>
                  <option value="deposit">Deposit</option>
                  <option value="final_payment">Final payment</option>
                  <option value="other">Other</option>
                </select>
              </Label>
              <Label text="Amount (£)">
                <input
                  type="number"
                  step="0.01"
                  name="amount_gbp"
                  required
                  placeholder="1000.00"
                  className={inputCls}
                  defaultValue={commission.deposit_amount_gbp ?? ""}
                />
              </Label>
              <SaveBtn label="Add payment" />
            </form>
          </AdminSection>

          {/* Shipping */}
          <AdminSection title="Shipping">
            <form action={upsertCommissionShipping} className="grid gap-3">
              <input type="hidden" name="commission_id" value={id} />
              <Label text="Carrier">
                <input type="text" name="carrier" defaultValue={shipping?.carrier ?? ""} className={inputCls} placeholder="Royal Mail" />
              </Label>
              <Label text="Tracking number">
                <input type="text" name="tracking_number" defaultValue={shipping?.tracking_number ?? ""} className={inputCls} />
              </Label>
              <Label text="Tracking URL">
                <input type="url" name="tracking_url" defaultValue={shipping?.tracking_url ?? ""} className={inputCls} />
              </Label>
              <Label text="Estimated delivery">
                <input type="date" name="estimated_delivery" defaultValue={shipping?.estimated_delivery ?? ""} className={inputCls} />
              </Label>
              <Label text="Shipped at">
                <input type="datetime-local" name="shipped_at" defaultValue={shipping?.shipped_at ? shipping?.shipped_at.slice(0, 16) : ""} className={inputCls} />
              </Label>
              <Label text="Delivered at">
                <input type="datetime-local" name="delivered_at" defaultValue={shipping?.delivered_at ? shipping?.delivered_at.slice(0, 16) : ""} className={inputCls} />
              </Label>
              <Label text="Note for client">
                <textarea name="client_note" rows={2} defaultValue={shipping?.client_note ?? ""} className={textareaCls} />
              </Label>
              <SaveBtn label="Save shipping" />
            </form>
          </AdminSection>

          {/* Updates list */}
          {(updates ?? []).length > 0 && (
            <AdminSection title="Posted Updates">
              <div className="grid gap-3">
                {(updates ?? []).map((u) => (
                  <div key={u.id} className="border-l-2 border-line pl-3">
                    {u.title && <p className="text-xs font-semibold">{u.title}</p>}
                    <p className="text-xs text-graphite leading-5 line-clamp-2">{u.body}</p>
                    <p className="mt-0.5 text-xs text-graphite/50">
                      {formatDate(u.created_at)}
                      {" · "}
                      {u.is_client_visible ? (
                        <span className="text-green-700">Visible</span>
                      ) : (
                        <span className="text-amber-700">Admin only</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </AdminSection>
          )}

        </div>
      </div>
    </section>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line">
      <div className="border-b border-line bg-chalk px-5 py-3">
        <p className="font-title text-xs font-bold uppercase tracking-[0.12em]">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs uppercase tracking-[0.1em] text-graphite">
      {text}
      {children}
    </label>
  );
}

function SaveBtn({ label = "Save changes" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="justify-self-start border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-chalk transition hover:bg-graphite"
    >
      {label}
    </button>
  );
}
