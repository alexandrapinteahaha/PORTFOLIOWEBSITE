"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function ensureBucket(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  bucketName: string = "artworks"
) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucketName);
  if (!exists) {
    await supabase.storage.createBucket(bucketName, { public: true });
  }
}

async function uploadImage(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  imageFile: File,
  prefix: string,
  bucket: string = "artworks"
): Promise<string> {
  await ensureBucket(supabase, bucket);
  const ext = imageFile.name.split(".").pop() ?? "jpg";
  const fileName = `${prefix}-${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, imageFile, { contentType: imageFile.type, upsert: true });
  if (error || !data) return "";
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function createArtwork(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const imageFile = formData.get("image") as File;
  const slug = String(formData.get("slug") ?? "artwork");
  const imageUrl = imageFile?.size > 0 ? await uploadImage(supabase, imageFile, slug) : "";

  const mediumType = String(formData.get("medium_type") ?? "painting");

  await supabase.from("artworks").insert({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    medium: String(formData.get("medium") ?? ""),
    dimensions: String(formData.get("dimensions") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "available"),
    categories: ["original", mediumType],
    series: String(formData.get("series") ?? "") || null,
    price_gbp: null,
    edition_info: String(formData.get("edition_info") ?? "") || null,
    shipping_notes: String(formData.get("shipping_notes") ?? "") || null,
    certificate_note: String(formData.get("certificate_note") ?? "") || null,
    print_available: false,
    image_url: imageUrl,
    gallery: []
  });
  revalidatePath("/admin/artworks");
  revalidatePath("/archive");
  revalidatePath("/");
}

export async function updateArtwork(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");

  const updates: Record<string, unknown> = {
    description: String(formData.get("description") ?? ""),
    medium: String(formData.get("medium") ?? ""),
    dimensions: String(formData.get("dimensions") ?? ""),
    edition_info: String(formData.get("edition_info") ?? "") || null,
    certificate_note: String(formData.get("certificate_note") ?? "") || null,
    shipping_notes: String(formData.get("shipping_notes") ?? "") || null,
  };

  const imageFile = formData.get("image") as File;
  if (imageFile?.size > 0) {
    updates.image_url = await uploadImage(supabase, imageFile, id);
  }

  await supabase.from("artworks").update(updates).eq("id", id);
  revalidatePath("/admin/artworks");
  revalidatePath("/archive");
  revalidatePath("/");
}

export async function deleteArtwork(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("artworks").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/artworks");
  revalidatePath("/portfolio");
}

export async function archiveSubscriber(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const stripeCustomerId = String(formData.get("stripe_customer_id"));
  await supabase
    .from("subscriptions")
    .update({ status: "admin_archived" })
    .eq("stripe_customer_id", stripeCustomerId);
  revalidatePath("/admin/subscribers");
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


export async function updateCommissionStatus(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("commission_enquiries")
    .update({ status: String(formData.get("status") ?? "reviewed") })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/commissions");
}
