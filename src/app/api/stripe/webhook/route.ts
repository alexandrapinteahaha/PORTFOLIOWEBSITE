import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productType = session.metadata?.product_type;

    await supabase.from("orders").upsert(
      {
        stripe_checkout_session_id: session.id,
        stripe_customer_id: String(session.customer ?? ""),
        email: session.customer_details?.email ?? null,
        status: "paid",
        total_gbp: session.amount_total ? session.amount_total / 100 : null,
        currency: session.currency ?? "gbp",
        metadata: session.metadata ?? {}
      },
      { onConflict: "stripe_checkout_session_id" }
    );

    if (productType === "original" && session.metadata?.product_id) {
      await supabase.rpc("mark_original_product_sold", {
        purchased_product_id: session.metadata.product_id,
        checkout_session_id: session.id
      });
    }

    if (productType === "print_club_subscription") {
      await supabase.from("subscriptions").upsert(
        {
          stripe_subscription_id: String(session.subscription),
          stripe_customer_id: String(session.customer),
          status: "active",
          current_period_end: null
        },
        { onConflict: "stripe_subscription_id" }
      );
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const currentPeriodEnd = (subscription as unknown as { current_period_end?: number })
      .current_period_end;
    await supabase.from("subscriptions").upsert(
      {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: String(subscription.customer),
        status: subscription.status,
        current_period_end: currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000).toISOString()
          : null
      },
      { onConflict: "stripe_subscription_id" }
    );
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    await supabase
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("stripe_customer_id", String(invoice.customer));
  }

  return NextResponse.json({ received: true });
}
