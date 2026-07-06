"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
