import type { Metadata } from "next";
import { CommissionForm } from "@/components/forms/CommissionForm";

export const metadata: Metadata = {
  title: "Commissions"
};

export default function CommissionsPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-serif text-5xl font-light leading-tight">
            Commission enquiry
          </h1>
          <div className="mt-6 grid gap-5 text-sm leading-7 text-graphite">
            <p>
              Commissions are reviewed individually. Use the form to introduce
              your project, share context, and indicate budget range and
              timeframe.
            </p>
            <p>
              Alexandra works across sculpture, photography, multimedia, and
              digital practice. Each commission enquiry is considered on its
              own terms.
            </p>
            <div className="border-t border-line pt-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                Response times
              </h2>
              <p>
                All enquiries are read and responded to in order. Response
                times vary depending on current studio schedule.
              </p>
            </div>
          </div>
        </div>

        <CommissionForm />
      </div>
    </section>
  );
}
