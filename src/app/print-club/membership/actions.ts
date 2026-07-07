"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* ── File uploads ──────────────────────────────────────────────────────────── */

export async function uploadSubscriberFile(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const file = formData.get("file") as File | null;
  const title = String(formData.get("title") ?? "").trim();

  if (!file || file.size === 0) return { error: "No file selected." };

  // Create bucket if it doesn't exist yet
  await supabase.storage
    .createBucket("subscriber-files", {
      public: false,
      fileSizeLimit: 10485760,
    })
    .catch(() => {});

  const ext = file.name.split(".").pop() ?? "bin";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
  const path = `${slug}-${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("subscriber-files")
    .upload(path, bytes, { contentType: file.type });

  if (error) return { error: error.message };

  revalidatePath("/print-club/membership");
  return { success: true };
}

export async function deleteSubscriberFile(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const path = String(formData.get("path") ?? "");
  await supabase.storage.from("subscriber-files").remove([path]);
  revalidatePath("/print-club/membership");
}

/* ── Profile ────────────────────────────────────────────────────────────────── */

export async function updateMyProfile(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  let userId: string;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return { error: "Not authenticated." };
    userId = data.user.id;
  } catch {
    return { error: "Not authenticated." };
  }

  const supabase = createSupabaseAdminClient();
  const birthdayRaw = Number(formData.get("birthday_month"));
  const shippingAddr = String(formData.get("shipping_address") ?? "").trim();
  const billingAddr = String(formData.get("billing_address") ?? "").trim();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      name: String(formData.get("name") ?? "").trim(),
      birthday_month: birthdayRaw >= 1 && birthdayRaw <= 12 ? birthdayRaw : null,
      shipping_address: shippingAddr,
      billing_address: billingAddr || shippingAddr,
    },
    { onConflict: "id" }
  );

  if (error) return { error: error.message };
  revalidatePath("/print-club/membership");
  return { success: true };
}

export async function saveProfileData(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const userId = String(formData.get("userId") ?? "").trim();
  if (!userId) return;

  const birthdayRaw = Number(formData.get("birthday_month"));
  const billingAddr = String(formData.get("billing_address") ?? "").trim();

  await supabase.from("profiles").upsert(
    {
      id: userId,
      name: String(formData.get("name") ?? "").trim(),
      birthday_month: birthdayRaw >= 1 && birthdayRaw <= 12 ? birthdayRaw : null,
      shipping_address: String(formData.get("shipping_address") ?? "").trim(),
      billing_address: billingAddr || String(formData.get("shipping_address") ?? "").trim(),
    },
    { onConflict: "id" }
  );
}

export async function adminUpdateSubscriptionStatus(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("subscriptions")
    .update({ status: String(formData.get("status")) })
    .eq("id", String(formData.get("id")));
  revalidatePath("/print-club/membership");
}

export async function adminCancelSubscription(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", String(formData.get("id")));
  revalidatePath("/print-club/membership");
}

export async function adminRemoveSubscription(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("subscriptions")
    .delete()
    .eq("id", String(formData.get("id")));
  revalidatePath("/print-club/membership");
}
