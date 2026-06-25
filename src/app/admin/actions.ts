"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createArtwork(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("artworks").insert({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    medium: String(formData.get("medium") ?? ""),
    dimensions: String(formData.get("dimensions") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "available"),
    categories: String(formData.get("categories") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    series: String(formData.get("series") ?? "") || null,
    price_gbp: formData.get("price_gbp") ? Number(formData.get("price_gbp")) : null,
    edition_info: String(formData.get("edition_info") ?? "") || null,
    shipping_notes: String(formData.get("shipping_notes") ?? "") || null,
    certificate_note:
      String(formData.get("certificate_note") ?? "") ||
      "Supplied with a signed certificate of authenticity.",
    print_available: formData.get("print_available") === "on",
    image_url: String(formData.get("image_url") ?? ""),
    gallery: []
  });
  revalidatePath("/admin/artworks");
  revalidatePath("/portfolio");
}

export async function deleteArtwork(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("artworks").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/artworks");
  revalidatePath("/portfolio");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("products").insert({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    product_type: String(formData.get("product_type") ?? "physical_print"),
    artwork_id: String(formData.get("artwork_id") ?? "") || null,
    description: String(formData.get("description") ?? ""),
    price_gbp: formData.get("price_gbp") ? Number(formData.get("price_gbp")) : null,
    stock_quantity: formData.get("stock_quantity")
      ? Number(formData.get("stock_quantity"))
      : null,
    is_active: formData.get("is_active") === "on",
    image_url: String(formData.get("image_url") ?? ""),
    stripe_price_id: String(formData.get("stripe_price_id") ?? "") || null
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("products").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function createPrintClubMonth(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("print_club_months").insert({
    project_id: String(formData.get("project_id") ?? "") || null,
    title: String(formData.get("title") ?? ""),
    month: Number(formData.get("month") ?? 1),
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    description: String(formData.get("description") ?? ""),
    image_url: String(formData.get("image_url") ?? ""),
    subscriber_only: true,
    shipping_status: "pending"
  });
  revalidatePath("/admin/print-club");
  revalidatePath("/print-club");
}

export async function updateCommissionStatus(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("commission_enquiries")
    .update({ status: String(formData.get("status") ?? "reviewed") })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/commissions");
}
