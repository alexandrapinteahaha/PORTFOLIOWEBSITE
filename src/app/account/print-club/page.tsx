import type { Metadata } from "next";
import Link from "next/link";
import { PortalButton } from "@/components/forms/PortalButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { requireUser } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Print Club Account"
};

function monthName(month: number) {
  const names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return names[month - 1] ?? month;
}

export default async function AccountPrintClubPage() {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_customer_id", profile?.stripe_customer_id ?? "")
    .in("status", ["active", "trialing"])
    .maybeSingle();

  const { data: months } = await supabase
    .from("print_club_months")
    .select("title,month,year,description,digital_file_id,process_pdf_id,monthly_letter_file_id")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  const isSubscriber = !!subscription;

  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-5 md:grid-cols-[280px_1fr]">
        <nav className="grid content-start gap-1 border border-line bg-chalk p-4">
          <p className="mb-3 border-b border-line pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
            Account
          </p>
          <Link
            href="/account"
            className="focus-ring block px-2 py-2 text-sm text-graphite transition-colors hover:text-ink"
          >
            Overview
          </Link>
          <Link
            href="/account/print-club"
            className="focus-ring block px-2 py-2 text-sm font-medium text-ink transition-colors hover:text-rust"
          >
            Print Club
          </Link>
        </nav>

        <div className="grid content-start gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-chalk p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
                Subscription status
              </p>
              <p className="mt-1.5 text-sm font-medium">
                {isSubscriber ? (
                  <span className="text-moss">Active</span>
                ) : (
                  <span className="text-graphite">Not subscribed</span>
                )}
              </p>
            </div>
            <PortalButton />
          </div>

          {!isSubscriber && (
            <div className="border border-line p-5">
              <SectionHeader
                title="Subscribe to Print Club"
                intro="Subscribe to unlock digital prints, process PDFs, monthly letters, and the full subscriber archive."
              />
              <div className="mt-6">
                <ButtonLink href="/print-club">View Print Club and subscribe</ButtonLink>
              </div>
            </div>
          )}

          {(months ?? []).length > 0 && (
            <div className="grid gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
                Monthly archive
              </h2>
              {(months ?? []).map((month) => (
                <article
                  key={`${month.year}-${month.month}`}
                  className="border border-line bg-chalk"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-line p-4">
                    <div>
                      <h3 className="font-sans text-xl font-medium">{month.title}</h3>
                      <p className="text-xs text-graphite">
                        {monthName(month.month)} {month.year}
                      </p>
                    </div>
                    {!isSubscriber && (
                      <span className="text-xs uppercase tracking-[0.1em] text-graphite">
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    {month.description && (
                      <p className="mb-4 text-sm leading-6 text-graphite">{month.description}</p>
                    )}

                    {isSubscriber ? (
                      <div className="flex flex-wrap gap-2">
                        <span className="border border-line bg-paper px-3 py-2 text-xs uppercase tracking-[0.1em] text-graphite">
                          Digital print file
                        </span>
                        <span className="border border-line bg-paper px-3 py-2 text-xs uppercase tracking-[0.1em] text-graphite">
                          Process PDF
                        </span>
                        <span className="border border-line bg-paper px-3 py-2 text-xs uppercase tracking-[0.1em] text-graphite">
                          Monthly letter
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-graphite">
                        Subscribe to access this month&apos;s files.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {(months ?? []).length === 0 && isSubscriber && (
            <div className="border border-dashed border-line bg-chalk px-8 py-10 text-center">
              <p className="text-sm text-graphite">
                Monthly releases will appear here as they are published.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
