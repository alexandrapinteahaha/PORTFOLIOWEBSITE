import { NextResponse } from "next/server";
import { requireUser } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export async function POST() {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!data?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Stripe customer is linked to this account yet." },
      { status: 404 }
    );
  }

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${getSiteUrl()}/account/print-club`
  });

  return NextResponse.json({ url: portal.url });
}
