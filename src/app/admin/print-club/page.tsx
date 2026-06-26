import type { Metadata } from "next";
import { PrintClubMonthForm } from "@/components/AdminForms";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin: Print Club"
};

function monthName(month: number) {
  const names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return names[month - 1] ?? month;
}

export default async function AdminPrintClubPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("print_club_months")
    .select("id,title,month,year,shipping_status")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-light">Print Club</h1>
        <p className="mt-2 text-sm text-graphite">
          Manage monthly entries. Each entry can hold an artwork image, digital print file, process PDF, and monthly letter reference.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
        <PrintClubMonthForm />

        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
            Monthly entries ({(data ?? []).length})
          </h2>
          <div className="grid gap-2">
            {(data ?? []).length === 0 && (
              <p className="text-sm text-graphite">No monthly entries yet.</p>
            )}
            {(data ?? []).map((month) => (
              <div key={month.id} className="border border-line bg-chalk p-4">
                <p className="font-serif text-xl">{month.title}</p>
                <p className="mt-1 text-xs text-graphite">
                  {monthName(month.month)} {month.year}
                  <span className="mx-1.5 text-line">|</span>
                  shipping: {month.shipping_status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
