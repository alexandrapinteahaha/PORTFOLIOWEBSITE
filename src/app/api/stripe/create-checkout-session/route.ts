import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validation";
import { seedProducts } from "@/lib/data/seed";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const stripe = getStripe();
  const siteUrl = getSiteUrl();

  if (parsed.data.productId === "print-club-subscription") {
    const price = process.env.STRIPE_PRINT_CLUB_PRICE_ID;

    if (!price) {
      return NextResponse.json(
        { error: "Print Club Stripe price is not configured." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/account/print-club?success=true`,
      cancel_url: `${siteUrl}/print-club?cancelled=true`,
      metadata: {
        product_type: "print_club_subscription"
      }
    });

    return NextResponse.json({ url: session.url });
  }

  const product = await loadCheckoutProduct(parsed.data.productId);

  if (!product || !product.is_active) {
    return NextResponse.json({ error: "This product is not available." }, { status: 404 });
  }

  if (product.product_type === "original" && product.stock_quantity !== 1) {
    return NextResponse.json(
      { error: "This original artwork is no longer available." },
      { status: 409 }
    );
  }

  if (!product.price_gbp || product.price_gbp <= 0) {
    return NextResponse.json({ error: "This item is enquiry only." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.title,
            description: product.description ?? undefined,
            images: product.image_url ? [product.image_url] : undefined
          },
          unit_amount: product.price_gbp * 100
        },
        quantity: parsed.data.quantity
      }
    ],
    success_url: `${siteUrl}/shop/${product.slug}?success=true`,
    cancel_url: `${siteUrl}/shop/${product.slug}?cancelled=true`,
    metadata: {
      product_id: product.id,
      product_type: product.product_type,
      artwork_id: product.artwork_id ?? ""
    },
    shipping_address_collection: {
      allowed_countries: [
        "GB",
        "US",
        "CA",
        "AU",
        "NZ",
        "IE",
        "FR",
        "DE",
        "IT",
        "ES",
        "NL",
        "BE"
      ]
    }
  });

  return NextResponse.json({ url: session.url });
}

async function loadCheckoutProduct(productId: string) {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch {
    const fallback = seedProducts.find((product) => product.id === productId);

    if (!fallback) {
      return null;
    }

    return {
      id: fallback.id,
      slug: fallback.slug,
      title: fallback.title,
      product_type: fallback.productType,
      artwork_id: fallback.artworkId,
      description: fallback.description,
      price_gbp: fallback.priceGbp,
      stock_quantity: fallback.stockQuantity,
      is_active: fallback.isActive,
      image_url: fallback.imageUrl
    };
  }
}
