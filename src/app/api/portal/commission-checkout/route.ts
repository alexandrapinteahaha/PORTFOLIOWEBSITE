import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/portal/commission-checkout
 *
 * Creates a Stripe Checkout session for a commission payment (deposit or final).
 *
 * Body: { payment_id: string }
 *
 * Security:
 * - User must be authenticated as a portal client.
 * - payment record must belong to the authenticated client's commission.
 * - payment must have status "pending" (cannot re-pay an already-paid record).
 * - STRIPE_SECRET_KEY is used server-side only — never exposed to the browser.
 * - Payment confirmation happens ONLY via Stripe webhook — this route just creates a session.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Authenticate ──────────────────────────────────────────────────────
  const supabaseServer = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // ── 2. Parse body (JSON or form-encoded) ────────────────────────────────
  let paymentId: string | undefined;
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      paymentId = typeof body?.payment_id === "string" ? body.payment_id : undefined;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    // application/x-www-form-urlencoded (plain HTML form POST)
    const formData = await req.formData();
    const raw = formData.get("payment_id");
    paymentId = typeof raw === "string" ? raw : undefined;
  }

  if (!paymentId) {
    return NextResponse.json({ error: "payment_id is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // ── 3. Look up portal client ─────────────────────────────────────────────
  const { data: portalClient } = await supabase
    .from("portal_clients")
    .select("id, name, email")
    .eq("auth_user_id", user.id)
    .single();

  if (!portalClient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── 4. Fetch payment record and verify full ownership chain ──────────────
  //    payment → commission → client (must match authenticated client)
  const { data: payment } = await supabase
    .from("commission_payments")
    .select("id, commission_id, client_id, payment_type, amount_gbp, status, stripe_payment_intent_id")
    .eq("id", paymentId)
    .eq("client_id", portalClient.id) // ownership check
    .single();

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (payment.status !== "pending") {
    return NextResponse.json({ error: "Payment is not pending" }, { status: 409 });
  }

  // Verify commission also belongs to this client
  const { data: commission } = await supabase
    .from("commissions")
    .select("id, reference, artwork_title, client_id")
    .eq("id", payment.commission_id)
    .eq("client_id", portalClient.id)
    .single();

  if (!commission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ── 5. Create Stripe Checkout session ────────────────────────────────────
  const amountPence = Math.round(Number(payment.amount_gbp) * 100);

  const paymentTypeLabel =
    payment.payment_type === "deposit"
      ? "Deposit"
      : payment.payment_type === "final_payment"
        ? "Final Payment"
        : "Payment";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "gbp",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: amountPence,
          product_data: {
            name: `${paymentTypeLabel} — ${commission.artwork_title}`,
            description: `Commission ${commission.reference}`,
          },
        },
        quantity: 1,
      },
    ],
    customer_email: portalClient.email,
    metadata: {
      payment_type: "commission_payment",
      commission_payment_id: payment.id,
      commission_id: commission.id,
      client_id: portalClient.id,
      commission_reference: commission.reference,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/commission/${commission.reference}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/commission/${commission.reference}?payment=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  // Store the Stripe session ID on the payment record for webhook matching
  await supabase
    .from("commission_payments")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", payment.id);

  // Plain form POST → redirect to Stripe; fetch/JSON → return URL in body
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(session.url, { status: 303 });
  }

  return NextResponse.json({ url: session.url });
}
