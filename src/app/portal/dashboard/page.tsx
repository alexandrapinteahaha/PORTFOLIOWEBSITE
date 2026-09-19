import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

// Contextual message shown below the welcome heading, changes per stage
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

// Six-step progress display — maps commission status → step index (0-based)
const PROGRESS_STEPS = ["Agreement", "Deposit", "Concept", "Production", "Completion", "Delivery"];

function getProgressIndex(status: string): number {
  const map: Record<string, number> = {
    agreement_pending: 0, agreement_signed: 0,
    deposit_pending: 1, deposit_paid: 1,
    concept: 2, concept_review: 2, concept_approved: 2,
    production: 3, final_review: 3, final_payment_pending: 3, final_payment_paid: 3,
    completed: 4,
    shipping: 5, delivered: 5,
  };
  return map[status] ?? 0;
}

export default async function PortalDashboardPage() {
  const { client } = await requirePortalClient();
  const supabase = createSupabaseAdminClient();

  const { data: commissions } = await supabase
    .from("commissions")
    .select(`
      id, reference, artwork_title, medium, dimensions,
      agreed_price_gbp, currency, status,
      estimated_completion, created_at, updated_at
    `)
    .eq("client_id", client.id)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  const commission   = commissions?.[0] ?? null;
  const otherComms   = (commissions ?? []).slice(1);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!commission) {
    return (
      <div className="container-shell py-16 lg:py-24">
        <h1 className="font-title text-5xl font-bold md:text-6xl">
          Welcome, {client.name.split(" ")[0]}.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-graphite">
          Your private commission portal is ready. Your commission will appear here once it has been set up.
        </p>
        <div className="mt-10 border border-line bg-chalk p-8">
          <p className="text-xs text-graphite">
            Questions?{" "}
            <a href="mailto:hello@alexandrapintea.art" className="underline underline-offset-4 hover:text-ink">
              hello@alexandrapintea.art
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ── Parallel data fetch ────────────────────────────────────────────────────
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
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("commission_documents")
      .select("id, document_type, label, file_size_bytes, uploaded_at")
      .eq("commission_id", commission.id)
      .eq("is_client_visible", true)
      .order("uploaded_at", { ascending: false })
      .limit(5),
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

  // ── Derived values ─────────────────────────────────────────────────────────
  const stageIndex     = getProgressIndex(commission.status);
  const contextMsg     = STAGE_MESSAGES[commission.status] ?? "";
  const pendingConcept = (concepts ?? []).find((c) => c.status === "pending");
  const pendingPayment = (payments ?? []).find((p) => p.status === "pending");
  const paidTotal      = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount_gbp), 0);
  const remaining = commission.agreed_price_gbp
    ? Math.max(0, Number(commission.agreed_price_gbp) - paidTotal)
    : null;
  const isShipped   = !!shipping?.shipped_at;
  const isDelivered = !!shipping?.delivered_at;

  // ── Derive client tasks from commission state ──────────────────────────────
  type Task = { title: string; desc: string; href?: string; paymentId?: string; urgent?: boolean };
  const tasks: Task[] = [];

  if (pendingConcept) {
    tasks.push({
      title:     "Review your concept",
      desc:      "A concept has been prepared for your commission. Please review it and share your thoughts.",
      href:      `/portal/commission/${commission.reference}`,
      urgent:    true,
    });
  }
  if (pendingPayment && commission.status === "deposit_pending") {
    tasks.push({
      title:     "Pay your deposit",
      desc:      `A deposit of ${formatCurrency(Number(pendingPayment.amount_gbp))} is required to begin the commission.`,
      paymentId: pendingPayment.id,
      urgent:    true,
    });
  }
  if (pendingPayment && ["final_payment_pending", "final_review"].includes(commission.status)) {
    tasks.push({
      title:     "Pay remaining balance",
      desc:      `The final payment of ${formatCurrency(Number(pendingPayment.amount_gbp))} is now due.`,
      paymentId: pendingPayment.id,
    });
  }

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? null;

  return (
    <div className="container-shell py-10 lg:py-14">

      {/* ── Welcome ───────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="font-title text-4xl font-bold leading-tight md:text-5xl">
          Welcome, {client.name.split(" ")[0]}.
        </h1>
        {contextMsg && (
          <p className="mt-3 max-w-lg text-sm leading-7 text-graphite">{contextMsg}</p>
        )}
      </div>

      {/* ── Row 1: Commission Status + Book a Call ────────────────────────────── */}
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_272px]">

        {/* Commission status card */}
        <div className="border border-line bg-white p-6 lg:p-8">
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

          {/* Six-step progress tracker */}
          <div className="mb-6">
            <div className="flex items-start">
              {PROGRESS_STEPS.map((step, i) => {
                const done   = i < stageIndex;
                const active = i === stageIndex;
                return (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      {i > 0 && (
                        <div className={`h-px flex-1 transition-colors ${i <= stageIndex ? "bg-ink" : "bg-line"}`} />
                      )}
                      <div
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                          done   ? "bg-ink text-chalk"
                          : active ? "border-2 border-ink bg-white text-ink"
                                   : "border border-line bg-white text-graphite/30",
                        ].join(" ")}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      {i < PROGRESS_STEPS.length - 1 && (
                        <div className={`h-px flex-1 transition-colors ${i < stageIndex ? "bg-ink" : "bg-line"}`} />
                      )}
                    </div>
                    <p
                      className={[
                        "mt-2 hidden text-center text-[10px] uppercase tracking-[0.06em] sm:block",
                        done || active ? "font-semibold text-ink" : "text-graphite/30",
                      ].join(" ")}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commission meta */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4 text-xs">
            {commission.medium && (
              <span>
                <span className="text-graphite">Medium · </span>
                <span className="font-medium">{commission.medium}</span>
              </span>
            )}
            {commission.dimensions && (
              <span>
                <span className="text-graphite">Dimensions · </span>
                <span className="font-medium">{commission.dimensions}</span>
              </span>
            )}
            {commission.estimated_completion && (
              <span>
                <span className="text-graphite">Est. completion · </span>
                <span className="font-medium">{formatDate(commission.estimated_completion)}</span>
              </span>
            )}
            <span>
              <span className="text-graphite">Updated · </span>
              <span className="font-medium">{formatDate(commission.updated_at)}</span>
            </span>
          </div>

          <div className="mt-5">
            <Link
              href={`/portal/commission/${commission.reference}`}
              className="text-xs text-graphite underline underline-offset-4 hover:text-ink"
            >
              View full commission →
            </Link>
          </div>
        </div>

        {/* Studio / Book a call card */}
        <div className="flex flex-col border border-line bg-chalk p-6">
          <p className="mb-1 text-xs text-graphite">Studio</p>
          <h3 className="font-title text-xl font-bold">Book a call</h3>
          <p className="mt-3 flex-1 text-xs leading-6 text-graphite">
            Schedule a conversation with Alexandra to discuss your commission, review progress, or ask any questions.
          </p>
          <div className="mt-6 grid gap-2">
            <a
              href={
                bookingUrl ??
                `mailto:hello@alexandrapintea.art?subject=Book a call — ${commission.reference}&body=Hi Alexandra,%0A%0AI'd like to schedule a call regarding my commission (${commission.reference}).%0A%0A`
              }
              {...(bookingUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block border border-ink bg-ink px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite"
            >
              {bookingUrl ? "Schedule a call →" : "Request a call →"}
            </a>
            <a
              href={`mailto:hello@alexandrapintea.art?subject=${commission.reference} — ${commission.artwork_title}`}
              className="block border border-line bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-graphite transition hover:border-ink hover:text-ink"
            >
              Email the studio
            </a>
          </div>
        </div>
      </div>

      {/* ── Row 2: Action Required + Payment Summary ──────────────────────────── */}
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
                <div
                  key={i}
                  className={`border p-4 ${task.urgent ? "border-ink" : "border-line bg-chalk"}`}
                >
                  {task.urgent && (
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-graphite">
                      Needs your attention
                    </p>
                  )}
                  <p className="font-title text-sm font-bold">{task.title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-graphite">{task.desc}</p>
                  <div className="mt-3">
                    {task.href && (
                      <Link
                        href={task.href}
                        className="text-xs font-semibold underline underline-offset-4 hover:text-graphite"
                      >
                        View →
                      </Link>
                    )}
                    {task.paymentId && <PayButton paymentId={task.paymentId} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="border border-line bg-white p-6">
          <p className="mb-5 text-xs text-graphite">Payments</p>
          {(payments ?? []).length === 0 && !commission.agreed_price_gbp ? (
            <p className="text-xs leading-6 text-graphite">
              Payment information will appear here once your commission is confirmed.
            </p>
          ) : (
            <>
              {commission.agreed_price_gbp && (
                <div className="mb-5 pb-5 border-b border-line">
                  <p className="text-xs text-graphite">Commission total</p>
                  <p className="font-title mt-1 text-3xl font-bold">
                    {formatCurrency(Number(commission.agreed_price_gbp), commission.currency)}
                  </p>
                </div>
              )}
              {(payments ?? []).length > 0 && (
                <div className="grid gap-0 divide-y divide-line">
                  {(payments ?? []).map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-xs font-medium capitalize">{p.payment_type.replace(/_/g, " ")}</p>
                        {p.paid_at && (
                          <p className="mt-0.5 text-xs text-graphite">{formatDate(p.paid_at)}</p>
                        )}
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
                <div className="mt-4 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-graphite">Remaining</p>
                    <p className="font-title text-xl font-bold">{formatCurrency(remaining)}</p>
                  </div>
                  {pendingPayment && (
                    <div className="mt-3">
                      <PayButton paymentId={pendingPayment.id} />
                    </div>
                  )}
                </div>
              )}
              {remaining === 0 && paidTotal > 0 && (
                <p className="mt-4 border-t border-line pt-4 text-xs font-semibold text-green-700">
                  ✓ Fully paid
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Row 3: Commission Journey ─────────────────────────────────────────── */}
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
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-chalk">
                        ✓
                      </span>
                    ) : stage.status === "active" ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink">
                        <span className="h-2 w-2 rounded-full bg-ink" />
                      </span>
                    ) : (
                      <span className="block h-5 w-5 rounded-full border border-line" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                        stage.status === "upcoming" ? "text-graphite/30" : "text-ink"
                      }`}
                    >
                      {label}
                    </p>
                    {stage.client_note && (
                      <p className="mt-0.5 text-xs text-graphite">{stage.client_note}</p>
                    )}
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
        </div>
      )}

      {/* ── Row 4: Latest Documents + Studio Updates ──────────────────────────── */}
      <div className="mb-5 grid gap-4 lg:grid-cols-2">

        {/* Latest Documents */}
        <div className="border border-line bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-graphite">Latest Documents</p>
            {(documents ?? []).length > 0 && (
              <Link
                href={`/portal/commission/${commission.reference}`}
                className="text-xs text-graphite underline underline-offset-4 hover:text-ink"
              >
                View all
              </Link>
            )}
          </div>
          {(documents ?? []).length === 0 ? (
            <p className="text-xs leading-6 text-graphite">
              Documents will appear here as your commission progresses — agreements, invoices, certificates and more.
            </p>
          ) : (
            <div className="grid gap-2">
              {(documents ?? []).map((doc) => (
                <a
                  key={doc.id}
                  href={`/api/portal/documents/${doc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-line px-4 py-3 transition hover:border-ink"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{doc.label}</p>
                    <p className="mt-0.5 text-xs text-graphite">
                      {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                      {" · "}
                      {formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                  <span className="ml-3 shrink-0 text-xs text-graphite/60">View →</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Studio Updates */}
        <div className="border border-line bg-white p-6">
          <p className="mb-5 text-xs text-graphite">Studio Updates</p>
          {(updates ?? []).length === 0 ? (
            <p className="text-xs leading-6 text-graphite">
              I&apos;ll post updates here as I work on your artwork — progress notes, photographs and milestones.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {(updates ?? []).map((update, i) => (
                <article key={update.id} className={i > 0 ? "pt-5" : ""} style={i < (updates ?? []).length - 1 ? { paddingBottom: "1.25rem" } : {}}>
                  <p className="mb-1 text-xs text-graphite">{formatDateTime(update.created_at)}</p>
                  {update.title && (
                    <p className="font-title text-sm font-bold">{update.title}</p>
                  )}
                  <p className={`text-xs leading-6 text-graphite line-clamp-4 whitespace-pre-wrap ${update.title ? "mt-1" : ""}`}>
                    {update.body}
                  </p>
                  <Link
                    href={`/portal/commission/${commission.reference}`}
                    className="mt-2 block text-xs text-graphite/60 underline underline-offset-4 hover:text-ink"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 5: Delivery (shown once shipped) ──────────────────────────────── */}
      {isShipped && shipping && (
        <div className="mb-5 border border-line bg-white p-6 lg:p-8">
          <p className="mb-5 text-xs text-graphite">Delivery</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shipping.carrier && (
              <div>
                <p className="text-xs text-graphite">Carrier</p>
                <p className="mt-1 text-sm font-medium">{shipping.carrier}</p>
              </div>
            )}
            {shipping.tracking_number && (
              <div>
                <p className="text-xs text-graphite">Tracking number</p>
                {shipping.tracking_url ? (
                  <a
                    href={shipping.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm font-medium underline underline-offset-4 hover:text-graphite"
                  >
                    {shipping.tracking_number}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium">{shipping.tracking_number}</p>
                )}
              </div>
            )}
            {shipping.estimated_delivery && (
              <div>
                <p className="text-xs text-graphite">Estimated delivery</p>
                <p className="mt-1 text-sm font-medium">{formatDate(shipping.estimated_delivery)}</p>
              </div>
            )}
            {isDelivered && shipping.delivered_at && (
              <div>
                <p className="text-xs text-graphite">Delivered</p>
                <p className="mt-1 text-sm font-semibold text-green-700">✓ {formatDate(shipping.delivered_at)}</p>
              </div>
            )}
          </div>
          {shipping.client_note && (
            <p className="mt-5 border-t border-line pt-5 text-xs leading-6 text-graphite">
              {shipping.client_note}
            </p>
          )}
        </div>
      )}

      {/* ── Other commissions ─────────────────────────────────────────────────── */}
      {otherComms.length > 0 && (
        <div className="mb-5">
          <p className="mb-3 text-xs text-graphite">Other commissions</p>
          <div className="grid gap-2">
            {otherComms.map((c) => (
              <Link
                key={c.id}
                href={`/portal/commission/${c.reference}`}
                className="flex items-center justify-between border border-line bg-chalk px-5 py-4 transition hover:border-ink"
              >
                <div>
                  <p className="text-xs text-graphite">{c.reference}</p>
                  <p className="font-title mt-0.5 text-sm font-bold">{c.artwork_title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-graphite">
                    {COMMISSION_STATUS_LABELS[c.status] ?? c.status}
                  </span>
                  <span className="text-xs text-graphite/60">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Plain HTML form — works without JS, no "use client" needed
function PayButton({ paymentId }: { paymentId: string }) {
  return (
    <form method="POST" action="/api/portal/commission-checkout" style={{ display: "inline" }}>
      <input type="hidden" name="payment_id" value={paymentId} />
      <button
        type="submit"
        className="border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite"
      >
        Pay now →
      </button>
    </form>
  );
}
