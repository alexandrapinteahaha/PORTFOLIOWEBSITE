"use server";

import { Resend } from "resend";
import { commissionSchema } from "@/lib/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FormState = {
  ok: boolean;
  message: string;
};

function buildNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  commissionType: string;
  budgetRange: string;
  timeframe: string;
  message: string;
}) {
  return `
New commission enquiry from ${data.name}

Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ""}
Type: ${data.commissionType}
Budget: ${data.budgetRange}
Timeframe: ${data.timeframe}

Message:
${data.message}

—
View in admin: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/commissions
  `.trim();
}

function buildConfirmationEmail(name: string) {
  return `
Hi ${name},

Thank you for your commission enquiry. I have received your message and will be in touch shortly.

Once your enquiry is reviewed and accepted, you will receive an invoice for a 50% non-refundable deposit to secure your place in the schedule.

Alexandra Pintea
alexandrapintea.art
  `.trim();
}

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

    if (error) throw error;

    // Send emails if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFICATION_EMAIL;
    if (resendKey && notifyEmail) {
      const resend = new Resend(resendKey);
      await Promise.all([
        // Notification to Alexandra
        resend.emails.send({
          from: "Alexandra Pintea <noreply@alexandrapintea.art>",
          to: notifyEmail,
          subject: `New commission enquiry — ${parsed.data.name}`,
          text: buildNotificationEmail(parsed.data),
        }),
        // Confirmation to enquirer
        resend.emails.send({
          from: "Alexandra Pintea <noreply@alexandrapintea.art>",
          to: parsed.data.email,
          subject: "Commission enquiry received — Alexandra Pintea",
          text: buildConfirmationEmail(parsed.data.name),
        }),
      ]);
    }

    return {
      ok: true,
      message: "Thank you. Your enquiry has been received — a confirmation has been sent to your email."
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again or contact directly."
    };
  }
}
