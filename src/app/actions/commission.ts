"use server";

import { commissionSchema } from "@/lib/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FormState = {
  ok: boolean;
  message: string;
};

export async function submitCommissionEnquiry(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = commissionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    commissionType: formData.get("commissionType"),
    budgetRange: formData.get("budgetRange"),
    timeframe: formData.get("timeframe"),
    message: formData.get("message"),
    website: formData.get("website") || undefined
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form and add enough detail to your message."
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("commission_enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone ?? null,
      commission_type: parsed.data.commissionType,
      budget_range: parsed.data.budgetRange,
      timeframe: parsed.data.timeframe,
      message: parsed.data.message,
      status: "new"
    });

    if (error) {
      throw error;
    }

    return {
      ok: true,
      message: "Thank you. Your enquiry has been received."
    };
  } catch {
    return {
      ok: false,
      message:
        "The enquiry form is ready, but Supabase is not connected yet. Add credentials to store enquiries."
    };
  }
}
