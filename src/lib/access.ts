import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PortalClient } from "@/lib/portal";

export async function requireUser(loginPath = "/print-club/membership") {
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

/**
 * Requires the current user to have an associated portal_clients record.
 *
 * On first login, automatically links the auth user to their portal_clients row
 * by email match (the admin creates the record before the client ever logs in).
 *
 * Security model:
 *   auth.uid() → portal_clients.auth_user_id → portal_clients.id
 *   All subsequent data access flows through this chain via RLS.
 *
 * If no portal_clients record exists for this user's email → redirect to
 * /portal?error=no_access (generic message, no account enumeration).
 */
export async function requirePortalClient(): Promise<{
  user: Awaited<ReturnType<typeof requireUser>>;
  client: PortalClient;
}> {
  const user = await requireUser("/portal");
  const supabase = createSupabaseAdminClient();

  // 1. Try to find by auth_user_id (all subsequent logins)
  const { data: byUid } = await supabase
    .from("portal_clients")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (byUid) return { user, client: byUid as PortalClient };

  // 2. First login — try to link by email
  if (user.email) {
    const { data: byEmail } = await supabase
      .from("portal_clients")
      .select("*")
      .eq("email", user.email.toLowerCase())
      .is("auth_user_id", null)
      .single();

    if (byEmail) {
      // Link this auth user to the portal client record
      await supabase
        .from("portal_clients")
        .update({ auth_user_id: user.id, updated_at: new Date().toISOString() })
        .eq("id", byEmail.id);

      // Write audit event
      await supabase.from("audit_logs").insert({
        event_type: "portal_first_login",
        actor_type: "client",
        actor_id: user.id,
        client_id: byEmail.id,
        metadata: { email: user.email },
      });

      return { user, client: { ...byEmail, auth_user_id: user.id } as PortalClient };
    }
  }

  // 3. No portal record → redirect with generic error (no account enumeration)
  redirect("/portal?error=no_access");
}
