import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePortalClient } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  COMMISSION_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  TIMELINE_STAGES,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/portal";
import { approveConceptVersion, requestConceptChanges } from "@/app/portal/actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ref: string }>;
}): Promise<Metadata> {
  const { ref } = await params;
  return { title: ref };
}

export default async function CommissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ approved?: string; changes?: string; payment?: string }>;
}) {
  const { ref } = await params;
  const { approved, changes, payment: paymentResult } = await searchParams;
  const { client } = await requirePortalClient();
  const supabase = createSupabaseAdminClient();

  // Fetch commission — verify it belongs to this client
  const { data: commission } = await supabase
    .from("commissions")
    .select(`
      id, reference, artwork_title, description, medium, dimensions,
      agreed_price_gbp, currency, deposit_amount_gbp, status,
      estimated_completion, invitation_sent_at, created_at, updated_at
    `)
    .eq("reference", ref)
    .eq("client_id", client.id)
    .single();

  if (!commission) notFound();

  // Log portal access
  await supabase.from("audit_logs").insert({
    event_type: "portal_accessed",
    actor_type: "client",
    actor_id: client.auth_user_id,
    commission_id: commission.id,
    client_id: client.id,
    metadata: { reference: ref },
  });

  // Fetch all related data in parallel
  const [
    { data: timeline },
    { data: updates },
    { data: documents },
    { data: concepts },
    { data: payments },
    { data: shipping },
  ] = await Promise.all([
    supabase
      .from("commission_timeline")
      .select("id, stage, stage_order, status, completed_at, client_note")
      .eq("commission_id", commission.id)
      .order("stage_order"),
    supabase
      .from("commission_updates")
      .select("id, title, body, created_at")
      .eq("commission_id", commission.id)
      .eq("is_client_visible", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("commission_documents")
      .select("id, document_type, label, file_size_bytes, mime_type, uploaded_at")
      .eq("commission_id", commission.id)
      .eq("is_client_visible", true)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("concept_versions")
      .select("id, version_number, label, notes, status, created_at")
      .eq("commission_id", commission.id)
      .order("version_number", { ascending: false }),
    supabase
      .from("commission_payments")
      .select("id, payment_type, amount_gbp, currency, status, paid_at")
      .eq("commission_id", commission.id)
      .eq("client_id", client.id),
    supabase
      .from("commission_shipping")
      .select("carrier, tracking_number, tracking_url, estimated_delivery, shipped_at, delivered_at, client_note")
      .eq("commission_id", commission.id)
      .single(),
  ]);

  const paidTotal = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount_gbp), 0);
  const pendingPayment = (payments ?? []).find((p) => p.status === "pending");

  // The active/latest concept that needs action
  const activeConcept = (concepts ?? []).find((c) => c.status === "pending");
  const isCompleted = ["completed", "delivered", "archived"].includes(commission.status);

  return (
    <div className="container-shell py-12">

      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/portal/dashboard" className="text-xs text-graphite underline underline-offset-4 hover:text-ink">
          ← Back to portal
        </Link>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label text-graphite">{commission.reference}</p>
          <h1 className="mt-1 font-title text-4xl font-bold leading-tight">
            {commission.artwork_title}
          </h1>
          {isCompleted && (
            <p className="mt-2 font-title text-sm font-bold uppercase tracking-[0.1em] text-green-700">
              ✓ Commission Complete
            </p>
          )}
        </div>
        <span className="inline-block border border-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em]">
          {COMMISSION_STATUS_LABELS[commission.status] ?? commission.status}
        </span>
      </div>

      {/* Feedback banners */}
      {approved && (
        <div className="mb-6 border border-green-300 bg-green-50 px-5 py-4">
          <p className="text-sm font-semibold text-green-800">Concept approved.</p>
          <p className="mt-1 text-sm text-green-700">Thank you — Alexandra has been notified.</p>
        </div>
      )}
      {changes && (
        <div className="mb-6 border border-line bg-chalk px-5 py-4">
          <p className="text-sm font-semibold">Change request submitted.</p>
          <p className="mt-1 text-sm text-graphite">Your feedback has been sent to Alexandra.</p>
        </div>
      )}
      {paymentResult === "success" && (
        <div className="mb-6 border border-green-300 bg-green-50 px-5 py-4">
          <p className="text-sm font-semibold text-green-800">Payment received — thank you.</p>
          <p className="mt-1 text-sm text-green-700">Your payment is being processed. This page will update shortly.</p>
        </div>
      )}
      {paymentResult === "cancelled" && (
        <div className="mb-6 border border-amber-300 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-800">Payment cancelled.</p>
          <p className="mt-1 text-sm text-amber-700">No payment was taken. You can try again below.</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-8">

          {/* ── Timeline ──────────────────────────────────────────────────── */}
          {(timeline ?? []).length > 0 && (
            <Section title="Project Timeline">
              <div className="grid gap-0">
                {(timeline ?? []).map((stage, i) => {
                  const stageLabel = TIMELINE_STAGES.find(
                    (s) => s.stage === stage.stage
                  )?.label ?? stage.stage;
                  return (
                    <div
                      key={stage.id}
                      className={[
                        "flex items-start gap-4 border-b border-line py-4 last:border-b-0",
                      ].join(" ")}
                    >
                      {/* Status dot */}
                      <div className="mt-0.5 shrink-0">
                        {stage.status === "completed" ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-chalk">
                            ✓
                          </span>
                        ) : stage.status === "active" ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-white">
                            <span className="h-2 w-2 rounded-full bg-ink" />
                          </span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line bg-white text-xs text-graphite/40">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={[
                            "font-title text-sm font-bold uppercase tracking-[0.08em]",
                            stage.status === "upcoming"
                              ? "text-graphite/40"
                              : "text-ink",
                          ].join(" ")}
                        >
                          {stageLabel}
                        </p>
                        {stage.status === "completed" && stage.completed_at && (
                          <p className="mt-0.5 text-xs text-graphite">
                            {formatDate(stage.completed_at)}
                          </p>
                        )}
                        {stage.client_note && (
                          <p className="mt-1 text-xs text-graphite">{stage.client_note}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-xs text-graphite/40">
                        {stage.status === "completed"
                          ? "Complete"
                          : stage.status === "active"
                          ? "In progress"
                          : "Upcoming"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Concept Review ────────────────────────────────────────────── */}
          {(concepts ?? []).length > 0 && (
            <Section title="Concepts">
              <div className="grid gap-4">
                {(concepts ?? []).map((concept) => (
                  <div
                    key={concept.id}
                    className={[
                      "border p-5",
                      concept.status === "approved"
                        ? "border-green-300 bg-green-50"
                        : concept.status === "pending"
                        ? "border-ink bg-white"
                        : "border-line bg-chalk",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-title text-sm font-bold">
                          {concept.label ?? `Concept v${concept.version_number}`}
                        </p>
                        <p className="mt-0.5 text-xs text-graphite">
                          Uploaded {formatDate(concept.created_at)}
                        </p>
                      </div>
                      <StatusChip status={concept.status} />
                    </div>

                    {concept.notes && (
                      <p className="mt-3 text-sm leading-6 text-graphite">{concept.notes}</p>
                    )}

                    {/* View concept file */}
                    <div className="mt-3">
                      <a
                        href={`/api/portal/documents/${concept.id}?type=concept`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline underline-offset-4 hover:text-ink"
                      >
                        View concept file →
                      </a>
                    </div>

                    {/* Approval actions — only on the pending concept */}
                    {concept.status === "pending" && (
                      <div className="mt-5 border-t border-line pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                          Your action required
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <form action={approveConceptVersion}>
                            <input type="hidden" name="concept_version_id" value={concept.id} />
                            <input type="hidden" name="commission_id" value={commission.id} />
                            <input type="hidden" name="commission_ref" value={commission.reference} />
                            <button
                              type="submit"
                              className="border border-green-600 bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-green-700"
                            >
                              Approve concept
                            </button>
                          </form>

                          {/* Request changes — inline details/summary */}
                          <details>
                            <summary className="cursor-pointer list-none border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-graphite hover:border-ink hover:text-ink">
                              Request changes
                            </summary>
                            <div className="mt-2 border border-line bg-white p-4">
                              <form action={requestConceptChanges} className="grid gap-3">
                                <input type="hidden" name="concept_version_id" value={concept.id} />
                                <input type="hidden" name="commission_id" value={commission.id} />
                                <input type="hidden" name="commission_ref" value={commission.reference} />
                                <label className="grid gap-1 text-xs uppercase tracking-[0.1em] text-graphite">
                                  Your feedback
                                  <textarea
                                    name="changes_note"
                                    rows={4}
                                    placeholder="Please describe the changes you'd like…"
                                    className="border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-graphite/40 focus:border-ink focus:outline-none"
                                  />
                                </label>
                                <button
                                  type="submit"
                                  className="border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition hover:bg-ink hover:text-chalk"
                                >
                                  Submit feedback
                                </button>
                              </form>
                            </div>
                          </details>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Updates ───────────────────────────────────────────────────── */}
          {(updates ?? []).length > 0 && (
            <Section title="Updates">
              <div className="grid gap-4">
                {(updates ?? []).map((update) => (
                  <article key={update.id} className="border-l-2 border-ink pl-4">
                    {update.title && (
                      <p className="font-title text-sm font-bold">{update.title}</p>
                    )}
                    <p className="mt-1 text-sm leading-7 text-graphite whitespace-pre-wrap">
                      {update.body}
                    </p>
                    <p className="mt-2 text-xs text-graphite/50">
                      {formatDateTime(update.created_at)}
                    </p>
                  </article>
                ))}
              </div>
            </Section>
          )}

          {/* ── Documents ─────────────────────────────────────────────────── */}
          {(documents ?? []).length > 0 && (
            <Section title="Documents">
              <div className="grid gap-2">
                {(documents ?? []).map((doc) => (
                  <a
                    key={doc.id}
                    href={`/api/portal/documents/${doc.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-line bg-white px-4 py-3 transition hover:border-ink"
                  >
                    <div>
                      <p className="text-sm font-semibold">{doc.label}</p>
                      <p className="mt-0.5 text-xs text-graphite">
                        {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                        {doc.file_size_bytes &&
                          ` · ${(doc.file_size_bytes / 1024 / 1024).toFixed(1)} MB`}
                      </p>
                    </div>
                    <span className="text-xs text-graphite/60">View →</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className="grid gap-6 self-start">

          {/* Commission details */}
          <Section title="Commission">
            <dl className="grid gap-2">
              <Row label="Reference" value={commission.reference} />
              {commission.medium && <Row label="Medium" value={commission.medium} />}
              {commission.dimensions && <Row label="Dimensions" value={commission.dimensions} />}
              {commission.estimated_completion && (
                <Row label="Est. completion" value={formatDate(commission.estimated_completion)} />
              )}
              {commission.agreed_price_gbp && (
                <Row
                  label="Total"
                  value={formatCurrency(commission.agreed_price_gbp, commission.currency)}
                />
              )}
            </dl>
          </Section>

          {/* Payments */}
          {(payments ?? []).length > 0 && (
            <Section title="Payments">
              <div className="grid gap-3">
                {(payments ?? []).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold capitalize">
                        {payment.payment_type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-graphite">
                        {formatCurrency(payment.amount_gbp, payment.currency)}
                      </p>
                    </div>
                    <span
                      className={[
                        "text-xs font-semibold",
                        payment.status === "paid"
                          ? "text-green-700"
                          : payment.status === "pending"
                          ? "text-amber-600"
                          : "text-graphite",
                      ].join(" ")}
                    >
                      {payment.status === "paid"
                        ? "✓ Paid"
                        : payment.status === "pending"
                        ? "Due"
                        : payment.status}
                    </span>
                  </div>
                ))}

                {paidTotal > 0 && (
                  <div className="border-t border-line pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-graphite">Total paid</p>
                      <p className="text-xs font-semibold text-green-700">
                        {formatCurrency(paidTotal)}
                      </p>
                    </div>
                  </div>
                )}

                {pendingPayment && (
                  <div className="border-t border-line pt-3">
                    <p className="mb-2 text-xs text-graphite">
                      {formatCurrency(pendingPayment.amount_gbp)} due
                    </p>
                    <PayButton paymentId={pendingPayment.id} />
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Shipping */}
          {shipping && (
            <Section title="Shipping">
              {shipping.shipped_at ? (
                <dl className="grid gap-2">
                  {shipping.carrier && <Row label="Carrier" value={shipping.carrier} />}
                  {shipping.tracking_number && (
                    <div>
                      <dt className="text-xs text-graphite">Tracking</dt>
                      {shipping.tracking_url ? (
                        <a
                          href={shipping.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 text-xs underline underline-offset-4 hover:text-ink"
                        >
                          {shipping.tracking_number}
                        </a>
                      ) : (
                        <dd className="mt-0.5 text-xs font-semibold">
                          {shipping.tracking_number}
                        </dd>
                      )}
                    </div>
                  )}
                  {shipping.estimated_delivery && (
                    <Row label="Est. delivery" value={formatDate(shipping.estimated_delivery)} />
                  )}
                  {shipping.delivered_at && (
                    <Row label="Delivered" value={formatDate(shipping.delivered_at)} />
                  )}
                  {shipping.client_note && (
                    <p className="text-xs leading-5 text-graphite">{shipping.client_note}</p>
                  )}
                </dl>
              ) : (
                <p className="text-xs text-graphite">Not yet shipped.</p>
              )}
            </Section>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line bg-white">
      <div className="border-b border-line bg-chalk px-5 py-3">
        <p className="font-title text-xs font-bold uppercase tracking-[0.12em]">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs text-graphite shrink-0">{label}</dt>
      <dd className="text-xs font-semibold text-right">{value}</dd>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved:          "border-green-300 text-green-700",
    pending:           "border-ink text-ink",
    changes_requested: "border-amber-400 text-amber-700",
    superseded:        "border-line text-graphite/50",
  };
  const labels: Record<string, string> = {
    approved:          "Approved ✓",
    pending:           "Awaiting your review",
    changes_requested: "Changes requested",
    superseded:        "Superseded",
  };
  return (
    <span className={`shrink-0 border px-2 py-1 text-xs font-semibold ${map[status] ?? "border-line text-graphite"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// Client component for the Pay button — needs to POST to API
function PayButton({ paymentId }: { paymentId: string }) {
  return (
    <form
      method="POST"
      action="/api/portal/commission-checkout"
      style={{ display: "inline" }}
    >
      <input type="hidden" name="payment_id" value={paymentId} />
      <button
        type="submit"
        className="w-full border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite"
      >
        Make payment →
      </button>
    </form>
  );
}
