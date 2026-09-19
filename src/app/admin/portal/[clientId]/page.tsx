import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  COMMISSION_STATUS_LABELS,
  COMMISSION_STATUSES,
  DOCUMENT_TYPE_LABELS,
  TIMELINE_STAGES,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/portal";

export const dynamic = "force-dynamic";

// ── Inline server actions ──────────────────────────────────────────────────────

async function adminUpdateStatus(formData: FormData) {
  "use server";
  await requireAdmin();
  const supabase     = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const clientId     = String(formData.get("client_id") ?? "");
  const status       = String(formData.get("status") ?? "");
  if (!commissionId || !status) redirect(`/admin/portal/${clientId}`);
  await supabase
    .from("commissions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", commissionId);
  await supabase.from("audit_logs").insert({
    event_type: "status_changed", actor_type: "admin",
    commission_id: commissionId, metadata: { new_status: status, via: "admin_portal" },
  });
  redirect(`/admin/portal/${clientId}`);
}

async function adminUpdateDetails(formData: FormData) {
  "use server";
  await requireAdmin();
  const supabase     = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const clientId     = String(formData.get("client_id") ?? "");
  await supabase
    .from("commissions")
    .update({
      artwork_title:        String(formData.get("artwork_title") ?? ""),
      medium:               String(formData.get("medium") ?? "") || null,
      dimensions:           String(formData.get("dimensions") ?? "") || null,
      estimated_completion: String(formData.get("estimated_completion") ?? "") || null,
      agreed_price_gbp:     formData.get("agreed_price_gbp") ? Number(formData.get("agreed_price_gbp")) : null,
      updated_at:           new Date().toISOString(),
    })
    .eq("id", commissionId);
  redirect(`/admin/portal/${clientId}`);
}

async function adminPostUpdate(formData: FormData) {
  "use server";
  await requireAdmin();
  const supabase     = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const clientId     = String(formData.get("client_id") ?? "");
  const body         = String(formData.get("body") ?? "").trim();
  if (body) {
    await supabase.from("commission_updates").insert({
      commission_id:     commissionId,
      title:             String(formData.get("title") ?? "") || null,
      body,
      is_client_visible: formData.get("is_client_visible") === "true",
    });
  }
  redirect(`/admin/portal/${clientId}`);
}

async function adminUpdateShipping(formData: FormData) {
  "use server";
  await requireAdmin();
  const supabase     = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const clientId     = String(formData.get("client_id") ?? "");
  await supabase.from("commission_shipping").upsert({
    commission_id:      commissionId,
    carrier:            String(formData.get("carrier") ?? "") || null,
    tracking_number:    String(formData.get("tracking_number") ?? "") || null,
    tracking_url:       String(formData.get("tracking_url") ?? "") || null,
    estimated_delivery: String(formData.get("estimated_delivery") ?? "") || null,
    shipped_at:         String(formData.get("shipped_at") ?? "") || null,
    delivered_at:       String(formData.get("delivered_at") ?? "") || null,
    client_note:        String(formData.get("client_note") ?? "") || null,
    updated_at:         new Date().toISOString(),
  }, { onConflict: "commission_id" });
  redirect(`/admin/portal/${clientId}`);
}

async function adminAddPayment(formData: FormData) {
  "use server";
  await requireAdmin();
  const supabase     = createSupabaseAdminClient();
  const commissionId = String(formData.get("commission_id") ?? "");
  const clientId     = String(formData.get("client_id") ?? "");
  const amount       = Number(formData.get("amount_gbp") ?? 0);
  const markPaid     = formData.get("mark_paid") === "true";
  if (amount > 0) {
    await supabase.from("commission_payments").insert({
      commission_id: commissionId,
      client_id:     clientId,
      payment_type:  String(formData.get("payment_type") ?? "deposit"),
      amount_gbp:    amount,
      currency:      "gbp",
      status:        markPaid ? "paid" : "pending",
      paid_at:       markPaid ? new Date().toISOString() : null,
    });
  }
  redirect(`/admin/portal/${clientId}`);
}

// ── Constants (mirrors client dashboard) ──────────────────────────────────────

const STAGE_MESSAGES: Record<string, string> = {
  agreement_pending:     "Your commission agreement is ready for review.",
  agreement_signed:      "Your agreement is confirmed. The next step is your deposit.",
  deposit_pending:       "Your deposit is due. Once received, I'll begin the initial concept work.",
  deposit_paid:          "Your deposit has been received — thank you. I'm working on the initial concept.",
  concept:               "I'm developing the initial concept for your commission.",
  concept_review:        "Your concept is ready for your review. Please take a look when you can.",
  concept_approved:      "Concept approved — I'm now creating your artwork in the studio.",
  production:            "Your artwork is currently being created.",
  final_review:          "Your artwork is complete and ready for your final review.",
  final_payment_pending: "Your artwork is complete. The final payment is now due.",
  final_payment_paid:    "Final payment received — your artwork is being prepared for dispatch.",
  completed:             "Your artwork is complete and is being carefully prepared for shipment.",
  shipping:              "Your artwork is on its way to you.",
  delivered:             "Your artwork has been delivered. Thank you for this commission.",
};

const PROGRESS_STEPS = ["Agreement", "Deposit", "Concept", "Production", "Completion", "Delivery"];

function getProgressIndex(status: string): number {
  const map: Record<string, number> = {
    agreement_pending: 0, agreement_signed: 0,
    deposit_pending: 1,   deposit_paid: 1,
    concept: 2, concept_review: 2, concept_approved: 2,
    production: 3, final_review: 3, final_payment_pending: 3, final_payment_paid: 3,
    completed: 4,
    shipping: 5, delivered: 5,
  };
  return map[status] ?? 0;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>;
}): Promise<Metadata> {
  const { clientId } = await params;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("portal_clients").select("name").eq("id", clientId).single();
  return { title: `Portal — ${data?.name ?? "Client"}` };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  await requireAdmin();
  const { clientId } = await params;
  const { preview }  = await searchParams;
  const isPreview    = preview === "1";
  const supabase     = createSupabaseAdminClient();

  const { data: client } = await supabase
    .from("portal_clients")
    .select("id, name, email, phone")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  const { data: commissions } = await supabase
    .from("commissions")
    .select(`
      id, reference, artwork_title, medium, dimensions,
      agreed_price_gbp, currency, status,
      estimated_completion, created_at, updated_at
    `)
    .eq("client_id", clientId)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  const commission = commissions?.[0] ?? null;
  const otherComms = (commissions ?? []).slice(1);

  const [
    { data: timeline },
    { data: updates },
    { data: documents },
    { data: concepts },
    { data: payments },
    { data: shipping },
  ] = commission
    ? await Promise.all([
        supabase.from("commission_timeline")
          .select("id, stage, stage_order, status, completed_at, client_note")
          .eq("commission_id", commission.id).order("stage_order"),
        supabase.from("commission_updates")
          .select("id, title, body, is_client_visible, created_at")
          .eq("commission_id", commission.id).order("created_at", { ascending: false }).limit(4),
        supabase.from("commission_documents")
          .select("id, document_type, label, is_client_visible, uploaded_at")
          .eq("commission_id", commission.id).order("uploaded_at", { ascending: false }).limit(6),
        supabase.from("concept_versions")
          .select("id, version_number, label, status, created_at")
          .eq("commission_id", commission.id).order("version_number", { ascending: false }),
        supabase.from("commission_payments")
          .select("id, payment_type, amount_gbp, currency, status, paid_at")
          .eq("commission_id", commission.id),
        supabase.from("commission_shipping")
          .select("carrier, tracking_number, tracking_url, estimated_delivery, shipped_at, delivered_at, client_note")
          .eq("commission_id", commission.id).single(),
      ])
    : Array(6).fill({ data: null }) as [
        { data: null }, { data: null }, { data: null },
        { data: null }, { data: null }, { data: null },
      ];

  const stageIndex     = commission ? getProgressIndex(commission.status) : 0;
  const contextMsg     = commission ? (STAGE_MESSAGES[commission.status] ?? "") : "";
  const pendingConcept = (concepts ?? []).find((c) => c.status === "pending");
  const pendingPayment = (payments ?? []).find((p) => p.status === "pending");
  const paidTotal      = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount_gbp), 0);
  const remaining = commission?.agreed_price_gbp
    ? Math.max(0, Number(commission.agreed_price_gbp) - paidTotal)
    : null;
  const isShipped   = !!shipping?.shipped_at;
  const isDelivered = !!shipping?.delivered_at;

  type Task = { title: string; desc: string; href?: string; paymentId?: string; urgent?: boolean };
  const tasks: Task[] = [];
  if (pendingConcept) tasks.push({ title: "Review your concept", desc: "A concept has been prepared for your commission. Please review and share your thoughts.", href: commission ? `/portal/commission/${commission.reference}` : undefined, urgent: true });
  if (pendingPayment && commission?.status === "deposit_pending") tasks.push({ title: "Pay your deposit", desc: `A deposit of ${formatCurrency(Number(pendingPayment.amount_gbp))} is required to begin the commission.`, paymentId: pendingPayment.id, urgent: true });
  if (pendingPayment && commission && ["final_payment_pending", "final_review"].includes(commission.status)) tasks.push({ title: "Pay remaining balance", desc: `The final payment of ${formatCurrency(Number(pendingPayment.amount_gbp))} is now due.`, paymentId: pendingPayment.id });

  // ── Shared input style ───────────────────────────────────────────────────
  const inp = "w-full border border-line bg-white px-3 py-2 text-xs focus:border-ink focus:outline-none";

  return (
    <div className="min-h-screen bg-paper">

      {/* ── Admin / Preview banner ─────────────────────────────────────────── */}
      {isPreview ? (
        <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50">
          <div className="container-shell flex items-center justify-between gap-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700">Previewing as client</span>
              <span className="text-amber-300">·</span>
              <span className="text-xs text-amber-900 font-medium truncate">{client.name}</span>
              <span className="hidden text-amber-300 sm:inline">·</span>
              <span className="hidden text-[10px] text-amber-600 sm:inline">Read-only — edit controls hidden</span>
            </div>
            <Link
              href={`/admin/portal/${clientId}`}
              className="shrink-0 border border-amber-300 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700 transition hover:bg-amber-50"
            >
              Exit preview
            </Link>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-50 bg-ink">
          <div className="container-shell flex items-center justify-between gap-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-chalk/50">Admin</span>
              <span className="text-chalk/20">·</span>
              <span className="text-xs font-semibold text-chalk truncate">{client.name}</span>
              {commission && (
                <>
                  <span className="hidden text-chalk/20 sm:inline">·</span>
                  <span className="hidden text-[10px] text-chalk/40 sm:inline">{commission.reference}</span>
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/portal/${clientId}?preview=1`}
                className="hidden border border-chalk/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-chalk/60 transition hover:border-chalk/40 hover:text-chalk sm:block"
              >
                Preview as client
              </Link>
              {commission && (
                <Link
                  href={`/admin/commissions/${commission.id}`}
                  className="hidden border border-chalk/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-chalk/60 transition hover:border-chalk/40 hover:text-chalk sm:block"
                >
                  Full admin ↗
                </Link>
              )}
              <Link
                href="/admin/clients"
                className="border border-chalk/30 bg-chalk/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-chalk/20"
              >
                ← Clients
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Portal header ─────────────────────────────────────────────────── */}
      <header className="border-b border-line bg-paper">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="font-title text-sm font-bold uppercase tracking-[0.12em] text-ink">
              Alexandra Pintea
            </span>
            <span className="hidden text-graphite/30 sm:inline">·</span>
            <span className="hidden text-xs text-graphite/50 sm:inline">Commission Portal</span>
          </div>
          <span className="text-xs italic text-graphite/40">{client.name}</span>
        </div>
      </header>

      {/* ── Portal content ────────────────────────────────────────────────── */}
      <div className="container-shell py-10 lg:py-14">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-title text-4xl font-bold leading-tight md:text-5xl">
            Welcome, {client.name.split(" ")[0]}.
          </h1>
          {contextMsg && (
            <p className="mt-3 max-w-lg text-sm leading-7 text-graphite">{contextMsg}</p>
          )}
        </div>

        {!commission ? (
          <div className="border border-line bg-chalk p-8">
            <p className="mb-4 text-sm text-graphite">No active commission for this client yet.</p>
            {!isPreview && (
              <Link
                href={`/admin/commissions/new?client_id=${clientId}`}
                className="inline-block border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite"
              >
                Create commission →
              </Link>
            )}
          </div>
        ) : (
          <>

            {/* ── Row 1: Commission Status + Studio card ─────────────────────── */}
            <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_272px]">

              {/* Commission status */}
              <div className="border border-line bg-white">
                <div className="p-6 lg:p-8">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs text-graphite">{commission.reference}</p>
                      <h2 className="font-title text-2xl font-bold leading-snug md:text-3xl">
                        {commission.artwork_title}
                      </h2>
                    </div>
                    <span className="shrink-0 border border-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em]">
                      {COMMISSION_STATUS_LABELS[commission.status] ?? commission.status}
                    </span>
                  </div>

                  {/* Progress tracker */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      {PROGRESS_STEPS.map((step, i) => {
                        const done   = i < stageIndex;
                        const active = i === stageIndex;
                        return (
                          <div key={step} className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                              {i > 0 && <div className={`h-px flex-1 ${i <= stageIndex ? "bg-ink" : "bg-line"}`} />}
                              <div className={[
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                done ? "bg-ink text-chalk" : active ? "border-2 border-ink bg-white text-ink" : "border border-line bg-white text-graphite/30",
                              ].join(" ")}>
                                {done ? "✓" : i + 1}
                              </div>
                              {i < PROGRESS_STEPS.length - 1 && <div className={`h-px flex-1 ${i < stageIndex ? "bg-ink" : "bg-line"}`} />}
                            </div>
                            <p className={[
                              "mt-2 hidden text-center text-[10px] uppercase tracking-[0.06em] sm:block",
                              done || active ? "font-semibold text-ink" : "text-graphite/30",
                            ].join(" ")}>{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4 text-xs">
                    {commission.medium && <span><span className="text-graphite">Medium · </span><span className="font-medium">{commission.medium}</span></span>}
                    {commission.dimensions && <span><span className="text-graphite">Dimensions · </span><span className="font-medium">{commission.dimensions}</span></span>}
                    {commission.estimated_completion && <span><span className="text-graphite">Est. completion · </span><span className="font-medium">{formatDate(commission.estimated_completion)}</span></span>}
                    {commission.agreed_price_gbp && <span><span className="text-graphite">Total · </span><span className="font-semibold">{formatCurrency(Number(commission.agreed_price_gbp))}</span></span>}
                    <span><span className="text-graphite">Updated · </span><span className="font-medium">{formatDate(commission.updated_at)}</span></span>
                  </div>
                </div>

                {/* Edit: commission status + details */}
                {!isPreview && (
                  <div className="border-t border-line bg-chalk/40">
                    <details>
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-3 text-xs font-semibold text-graphite hover:text-ink [&::-webkit-details-marker]:hidden">
                        <span>✎ Edit commission</span>
                        <span className="font-normal text-graphite/40">▾</span>
                      </summary>
                      <div className="border-t border-line bg-white px-6 py-5 grid gap-5">
                        {/* Status */}
                        <form action={adminUpdateStatus}>
                          <input type="hidden" name="commission_id" value={commission.id} />
                          <input type="hidden" name="client_id" value={clientId} />
                          <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Commission status</label>
                          <div className="flex gap-2">
                            <select name="status" defaultValue={commission.status} className={`flex-1 ${inp}`}>
                              {COMMISSION_STATUSES.map((s) => (
                                <option key={s} value={s}>{COMMISSION_STATUS_LABELS[s] ?? s}</option>
                              ))}
                            </select>
                            <button type="submit" className="shrink-0 border border-ink bg-ink px-4 py-2 text-xs font-semibold text-chalk transition hover:bg-graphite">
                              Update
                            </button>
                          </div>
                        </form>
                        {/* Details */}
                        <form action={adminUpdateDetails} className="grid gap-3 sm:grid-cols-2 pt-4 border-t border-line">
                          <input type="hidden" name="commission_id" value={commission.id} />
                          <input type="hidden" name="client_id" value={clientId} />
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Artwork title</label>
                            <input type="text" name="artwork_title" defaultValue={commission.artwork_title} className={inp} />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Total price (£)</label>
                            <input type="number" name="agreed_price_gbp" defaultValue={commission.agreed_price_gbp ?? ""} step="0.01" className={inp} />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Medium</label>
                            <input type="text" name="medium" defaultValue={commission.medium ?? ""} className={inp} />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Dimensions</label>
                            <input type="text" name="dimensions" defaultValue={commission.dimensions ?? ""} className={inp} />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Est. completion</label>
                            <input type="date" name="estimated_completion" defaultValue={commission.estimated_completion ?? ""} className={inp} />
                          </div>
                          <div className="flex items-end">
                            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-chalk transition hover:bg-graphite">
                              Save details
                            </button>
                          </div>
                        </form>
                      </div>
                    </details>
                  </div>
                )}
              </div>

              {/* Studio / Book a call */}
              <div className="flex flex-col border border-line bg-chalk p-6">
                <p className="mb-1 text-xs text-graphite">Studio</p>
                <h3 className="font-title text-xl font-bold">Book a call</h3>
                <p className="mt-3 flex-1 text-xs leading-6 text-graphite">
                  Schedule a conversation with Alexandra to discuss your commission, review progress, or ask any questions.
                </p>
                <div className="mt-6 grid gap-2">
                  <a
                    href={`mailto:hello@alexandrapintea.art?subject=Book a call — ${commission.reference}&body=Hi Alexandra,%0A%0AI'd like to schedule a call regarding my commission (${commission.reference}).%0A%0A`}
                    className="block border border-ink bg-ink px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite"
                  >
                    Request a call →
                  </a>
                  <a
                    href={`mailto:hello@alexandrapintea.art?subject=${commission.reference}`}
                    className="block border border-line bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-graphite transition hover:border-ink hover:text-ink"
                  >
                    Email the studio
                  </a>
                </div>
              </div>
            </div>

            {/* ── Row 2: Action Required + Payment Summary ──────────────────────── */}
            <div className="mb-5 grid gap-4 lg:grid-cols-2">

              {/* Action Required */}
              <div className="border border-line bg-white p-6">
                <p className="mb-5 text-xs text-graphite">Action Required</p>
                {tasks.length === 0 ? (
                  <div className="py-1">
                    <p className="font-title text-base font-bold">You&apos;re all caught up.</p>
                    <p className="mt-1.5 text-xs leading-6 text-graphite">
                      There are no actions required from you right now.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {tasks.map((task, i) => (
                      <div key={i} className={`border p-4 ${task.urgent ? "border-ink" : "border-line bg-chalk"}`}>
                        {task.urgent && <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-graphite">Needs attention</p>}
                        <p className="font-title text-sm font-bold">{task.title}</p>
                        <p className="mt-1.5 text-xs leading-5 text-graphite">{task.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!isPreview && (
                  <p className="mt-4 border-t border-line pt-3 text-[10px] text-graphite/40">
                    Tasks are derived from commission status. Update status above to change what the client sees here.
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="border border-line bg-white">
                <div className="p-6">
                  <p className="mb-5 text-xs text-graphite">Payments</p>
                  {(payments ?? []).length === 0 && !commission.agreed_price_gbp ? (
                    <p className="text-xs text-graphite">No payment records yet.</p>
                  ) : (
                    <>
                      {commission.agreed_price_gbp && (
                        <div className="mb-5 border-b border-line pb-5">
                          <p className="text-xs text-graphite">Commission total</p>
                          <p className="font-title mt-1 text-3xl font-bold">
                            {formatCurrency(Number(commission.agreed_price_gbp), commission.currency)}
                          </p>
                        </div>
                      )}
                      {(payments ?? []).length > 0 && (
                        <div className="divide-y divide-line">
                          {(payments ?? []).map((p) => (
                            <div key={p.id} className="flex items-center justify-between py-3">
                              <div>
                                <p className="text-xs font-medium capitalize">{p.payment_type.replace(/_/g, " ")}</p>
                                {p.paid_at && <p className="mt-0.5 text-xs text-graphite">{formatDate(p.paid_at)}</p>}
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-semibold">{formatCurrency(Number(p.amount_gbp))}</p>
                                <p className={`text-xs font-semibold ${p.status === "paid" ? "text-green-700" : "text-amber-600"}`}>
                                  {p.status === "paid" ? "✓ Paid" : "Outstanding"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {remaining !== null && remaining > 0 && (
                        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                          <p className="text-xs text-graphite">Remaining</p>
                          <p className="font-title text-xl font-bold">{formatCurrency(remaining)}</p>
                        </div>
                      )}
                      {remaining === 0 && paidTotal > 0 && (
                        <p className="mt-4 border-t border-line pt-4 text-xs font-semibold text-green-700">✓ Fully paid</p>
                      )}
                    </>
                  )}
                </div>
                {/* Edit: Add payment */}
                {!isPreview && (
                  <div className="border-t border-line bg-chalk/40">
                    <details>
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-3 text-xs font-semibold text-graphite hover:text-ink [&::-webkit-details-marker]:hidden">
                        <span>✎ Add payment record</span>
                        <span className="font-normal text-graphite/40">▾</span>
                      </summary>
                      <div className="border-t border-line bg-white px-6 py-5">
                        <form action={adminAddPayment} className="grid gap-3 sm:grid-cols-2">
                          <input type="hidden" name="commission_id" value={commission.id} />
                          <input type="hidden" name="client_id" value={clientId} />
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Type</label>
                            <select name="payment_type" className={inp}>
                              <option value="deposit">Deposit</option>
                              <option value="final_payment">Final payment</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Amount (£)</label>
                            <input type="number" name="amount_gbp" placeholder="0.00" step="0.01" min="0" className={inp} />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="flex items-center gap-2 text-xs text-graphite">
                              <input type="checkbox" name="mark_paid" value="true" />
                              Mark as already paid
                            </label>
                          </div>
                          <div>
                            <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-chalk transition hover:bg-graphite">
                              Add payment
                            </button>
                          </div>
                        </form>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 3: Commission Journey ──────────────────────────────────────── */}
            {(timeline ?? []).length > 0 && (
              <div className="mb-5 border border-line bg-white p-6 lg:p-8">
                <p className="mb-6 text-xs text-graphite">Commission Journey</p>
                <div className="divide-y divide-line">
                  {(timeline ?? []).map((stage) => {
                    const label = TIMELINE_STAGES.find((s) => s.stage === stage.stage)?.label ?? stage.stage;
                    return (
                      <div key={stage.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                        <div className="shrink-0">
                          {stage.status === "completed" ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-chalk">✓</span>
                          ) : stage.status === "active" ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink">
                              <span className="h-2 w-2 rounded-full bg-ink" />
                            </span>
                          ) : (
                            <span className="block h-5 w-5 rounded-full border border-line" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${stage.status === "upcoming" ? "text-graphite/30" : "text-ink"}`}>
                            {label}
                          </p>
                          {stage.client_note && <p className="mt-0.5 text-xs text-graphite">{stage.client_note}</p>}
                        </div>
                        <div className="shrink-0 text-right">
                          {stage.status === "completed" && stage.completed_at ? (
                            <p className="text-xs text-graphite">{formatDate(stage.completed_at)}</p>
                          ) : stage.status === "active" ? (
                            <p className="text-xs font-semibold text-ink">In progress</p>
                          ) : (
                            <p className="text-xs text-graphite/30">Upcoming</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!isPreview && (
                  <p className="mt-4 border-t border-line pt-3 text-[10px] text-graphite/40">
                    Stages update with commission status. Per-stage notes:{" "}
                    <Link href={`/admin/commissions/${commission.id}`} className="underline hover:text-graphite">
                      Full admin ↗
                    </Link>
                  </p>
                )}
              </div>
            )}

            {/* ── Row 4: Documents + Studio Updates ─────────────────────────────── */}
            <div className="mb-5 grid gap-4 lg:grid-cols-2">

              {/* Documents */}
              <div className="border border-line bg-white">
                <div className="p-6">
                  <p className="mb-5 text-xs text-graphite">Latest Documents</p>
                  {(documents ?? []).length === 0 ? (
                    <p className="text-xs text-graphite">No documents uploaded yet.</p>
                  ) : (
                    <div className="grid gap-2">
                      {(documents ?? []).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between border border-line px-4 py-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium">{doc.label}</p>
                              {!isPreview && !doc.is_client_visible && (
                                <span className="shrink-0 border border-line px-1 text-[10px] text-graphite/40">hidden</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-graphite">
                              {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type} · {formatDate(doc.uploaded_at)}
                            </p>
                          </div>
                          <a href={`/api/portal/documents/${doc.id}`} target="_blank" rel="noopener noreferrer" className="ml-3 shrink-0 text-xs text-graphite/60 hover:text-ink">
                            View →
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!isPreview && (
                  <div className="border-t border-line bg-chalk/40">
                    <div className="flex items-center justify-between px-6 py-3">
                      <span className="text-xs font-semibold text-graphite">✎ Manage documents</span>
                      <Link href={`/admin/commissions/${commission.id}`} className="text-xs text-graphite underline underline-offset-4 hover:text-ink">
                        Upload / manage ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Studio Updates */}
              <div className="border border-line bg-white">
                <div className="p-6">
                  <p className="mb-5 text-xs text-graphite">Studio Updates</p>
                  {(updates ?? []).length === 0 ? (
                    <p className="text-xs text-graphite">No studio updates yet.</p>
                  ) : (
                    <div className="divide-y divide-line">
                      {(updates ?? []).map((update, i) => (
                        <article key={update.id} className={i > 0 ? "pt-4" : ""} style={i < (updates ?? []).length - 1 ? { paddingBottom: "1rem" } : {}}>
                          <div className="mb-1 flex items-center gap-2">
                            <p className="text-xs text-graphite">{formatDateTime(update.created_at)}</p>
                            {!isPreview && !update.is_client_visible && (
                              <span className="border border-line px-1 text-[10px] text-graphite/40">draft</span>
                            )}
                          </div>
                          {update.title && <p className="font-title text-sm font-bold">{update.title}</p>}
                          <p className={`text-xs leading-6 text-graphite line-clamp-3 whitespace-pre-wrap ${update.title ? "mt-1" : ""}`}>
                            {update.body}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
                {/* Edit: Post update */}
                {!isPreview && (
                  <div className="border-t border-line bg-chalk/40">
                    <details>
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-3 text-xs font-semibold text-graphite hover:text-ink [&::-webkit-details-marker]:hidden">
                        <span>✎ Post studio update</span>
                        <span className="font-normal text-graphite/40">▾</span>
                      </summary>
                      <div className="border-t border-line bg-white px-6 py-5">
                        <form action={adminPostUpdate} className="grid gap-3">
                          <input type="hidden" name="commission_id" value={commission.id} />
                          <input type="hidden" name="client_id" value={clientId} />
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Title (optional)</label>
                            <input type="text" name="title" placeholder="e.g. Concept sketches complete" className={inp} />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Update *</label>
                            <textarea name="body" rows={4} required placeholder="Share a progress note with the client…" className={`${inp} resize-none`} />
                          </div>
                          <label className="flex items-center gap-2 text-xs text-graphite">
                            <input type="checkbox" name="is_client_visible" value="true" defaultChecked />
                            Visible to client immediately
                          </label>
                          <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-chalk transition hover:bg-graphite">
                            Post update
                          </button>
                        </form>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 5: Shipping ─────────────────────────────────────────────────── */}
            <div className="mb-5 border border-line bg-white">
              {isShipped && shipping && (
                <div className="p-6 lg:p-8">
                  <p className="mb-5 text-xs text-graphite">Delivery</p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {shipping.carrier && <div><p className="text-xs text-graphite">Carrier</p><p className="mt-1 text-sm font-medium">{shipping.carrier}</p></div>}
                    {shipping.tracking_number && (
                      <div>
                        <p className="text-xs text-graphite">Tracking</p>
                        {shipping.tracking_url
                          ? <a href={shipping.tracking_url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-medium underline underline-offset-4 hover:text-graphite">{shipping.tracking_number}</a>
                          : <p className="mt-1 text-sm font-medium">{shipping.tracking_number}</p>}
                      </div>
                    )}
                    {shipping.estimated_delivery && <div><p className="text-xs text-graphite">Estimated delivery</p><p className="mt-1 text-sm font-medium">{formatDate(shipping.estimated_delivery)}</p></div>}
                    {isDelivered && shipping.delivered_at && <div><p className="text-xs text-graphite">Delivered</p><p className="mt-1 text-sm font-semibold text-green-700">✓ {formatDate(shipping.delivered_at)}</p></div>}
                  </div>
                  {shipping.client_note && <p className="mt-5 border-t border-line pt-5 text-xs leading-6 text-graphite">{shipping.client_note}</p>}
                </div>
              )}
              {/* Edit: Shipping */}
              {!isPreview && (
                <div className={`${isShipped ? "border-t" : ""} border-line bg-chalk/40`}>
                  <details>
                    <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-3 text-xs font-semibold text-graphite hover:text-ink [&::-webkit-details-marker]:hidden">
                      <span>✎ {isShipped ? "Edit" : "Add"} shipping info</span>
                      <span className="font-normal text-graphite/40">▾</span>
                    </summary>
                    <div className="border-t border-line bg-white px-6 py-5">
                      <form action={adminUpdateShipping} className="grid gap-3 sm:grid-cols-2">
                        <input type="hidden" name="commission_id" value={commission.id} />
                        <input type="hidden" name="client_id" value={clientId} />
                        <div><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Carrier</label><input type="text" name="carrier" defaultValue={shipping?.carrier ?? ""} className={inp} /></div>
                        <div><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Tracking number</label><input type="text" name="tracking_number" defaultValue={shipping?.tracking_number ?? ""} className={inp} /></div>
                        <div className="sm:col-span-2"><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Tracking URL</label><input type="url" name="tracking_url" defaultValue={shipping?.tracking_url ?? ""} className={inp} /></div>
                        <div><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Shipped at</label><input type="date" name="shipped_at" defaultValue={shipping?.shipped_at?.slice(0, 10) ?? ""} className={inp} /></div>
                        <div><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Est. delivery</label><input type="date" name="estimated_delivery" defaultValue={shipping?.estimated_delivery?.slice(0, 10) ?? ""} className={inp} /></div>
                        <div><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Delivered at</label><input type="date" name="delivered_at" defaultValue={shipping?.delivered_at?.slice(0, 10) ?? ""} className={inp} /></div>
                        <div><label className="block text-[10px] uppercase tracking-[0.1em] text-graphite mb-1">Client note</label><input type="text" name="client_note" defaultValue={shipping?.client_note ?? ""} className={inp} /></div>
                        <div className="sm:col-span-2"><button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-chalk transition hover:bg-graphite">Save shipping</button></div>
                      </form>
                    </div>
                  </details>
                </div>
              )}
            </div>

            {/* Other commissions */}
            {otherComms.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 text-xs text-graphite">Other commissions</p>
                <div className="grid gap-2">
                  {otherComms.map((c) => (
                    <div key={c.id} className="flex items-center justify-between border border-line bg-chalk px-5 py-4">
                      <div>
                        <p className="text-xs text-graphite">{c.reference}</p>
                        <p className="font-title mt-0.5 text-sm font-bold">{c.artwork_title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-graphite">{COMMISSION_STATUS_LABELS[c.status] ?? c.status}</span>
                        {!isPreview && (
                          <Link href={`/admin/commissions/${c.id}`} className="text-xs text-graphite/60 underline underline-offset-4 hover:text-ink">Admin ↗</Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="container-shell flex flex-wrap items-center gap-5 py-6 text-xs text-graphite/40">
          <span>© {new Date().getFullYear()} Alexandra Pintea</span>
          <Link href="/" className="hover:text-ink">alexandrapintea.art ↗</Link>
        </div>
      </footer>
    </div>
  );
}
