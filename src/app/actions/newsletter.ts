"use server";

import { newsletterSchema } from "@/lib/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FormState = {
  ok: boolean;
  message: string;
};

export async function submitNewsletter(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    consent: formData.get("consent")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please enter a valid email and confirm consent."
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("newsletter_signups").upsert(
      {
        email: parsed.data.email.toLowerCase(),
        consent: true,
        source: "website",
        updated_at: new Date().toISOString()
      },
      { onConflict: "email" }
    );

    if (error) {
      throw error;
    }

    return {
      ok: true,
      message: "Thank you. You are on the list."
    };
  } catch {
    return {
      ok: false,
      message:
        "Signup storage is not connected yet. Add Supabase credentials to enable this form."
    };
  }
}
