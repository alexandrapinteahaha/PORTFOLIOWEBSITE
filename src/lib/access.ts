import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUser(loginPath = "/login") {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(loginPath);
    return user;
  } catch (err) {
    // Re-throw Next.js redirects, treat everything else as unauthenticated
    if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(loginPath);
  }
}

export async function requireAdmin() {
  const user = await requireUser("/admin/login");
  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
    redirect("/");
  }

  return user;
}
