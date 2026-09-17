"use server";

import { Resend } from "resend";
import { redirect } from "next/navigation";

export async function submitContactForm(formData: FormData) {
  const name    = String(formData.get("name") ?? "").trim();
  const email   = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    redirect("/contact?error=missing_fields");
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "alexandrapintea.art <noreply@alexandrapintea.art>",
      to:   "alexandrapinteaart@gmail.com",
      replyTo: email,
      subject: subject ? `[Contact] ${subject} — ${name}` : `[Contact] Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "—"}\n\n${message}`,
    });
  }

  redirect("/contact?sent=true");
}
