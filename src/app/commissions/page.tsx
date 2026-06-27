import type { Metadata } from "next";
import { CommissionForm } from "@/components/forms/CommissionForm";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Commissions"
};

const processSteps = [
  {
    num: "01",
    title: "Form Filling",
    body: "Complete the enquiry form with as much detail as possible — your project idea, intended use, budget range, and timeframe. The more context you provide, the better."
  },
  {
    num: "02",
    title: "Invoice & Deposit",
    body: "Once your enquiry is reviewed and accepted, you will receive an invoice for a 50% non-refundable deposit, payable by card. This secures your place in the schedule and confirms the commission. Work begins upon receipt of payment."
  },
  {
    num: "03",
    title: "Concept Build Up",
    body: "Alexandra develops the initial concept — drawing on the brief, references, and agreed scope. You will be kept informed at key stages of the process."
  },
  {
    num: "04",
    title: "Feedback Incorporation",
    body: "You will have the opportunity to review the work in progress and provide feedback. This is incorporated before the piece moves into its final stage."
  },
  {
    num: "05",
    title: "Revision",
    body: "A final round of refinement is made based on your feedback. Once approved, the remaining 50% balance is invoiced and the work is prepared for delivery."
  }
];

export default function CommissionsPage() {
  return (
    <>
      {/* ── Dark hero ──────────────────────────────────────── */}
      <section className="bg-ink text-chalk">
        <div className="container-shell py-20 md:py-28">
          <Reveal>
            <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(251,250,247,0.4)" }}>
              Bespoke work
            </p>
            <h1 className="mt-3 font-title text-5xl text-chalk md:text-6xl">
              Commission / Enquiry
            </h1>
            <div className="mt-8 max-w-2xl grid gap-5" style={{ fontSize: "17px", lineHeight: "1.85", color: "rgba(251,250,247,0.72)" }}>
              <p>
                Commissions are reviewed individually. Use the form to introduce your project, share context, and indicate budget range and timeframe.
              </p>
              <p>
                Alexandra works across sculpture, photography, multimedia, and digital practice. Each commission enquiry is considered on its own terms.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────── */}
      <section className="container-shell py-16 md:py-20">
        <Reveal>
          <CommissionForm />
        </Reveal>
      </section>

      {/* ── FAQ header ─────────────────────────────────────── */}
      <section className="bg-ink">
        <div className="container-shell py-12 md:py-16 text-center">
          <Reveal>
            <h2 className="font-title text-4xl text-chalk md:text-5xl">FAQ</h2>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ accordion ──────────────────────────────────── */}
      <section className="bg-paper">
        <div className="container-shell py-12 md:py-16">
          <Accordion
            items={[
              {
                question: "What is the Process?",
                answer: (
                  <div className="grid gap-0">
                    {processSteps.map(({ num, title, body }) => (
                      <div key={num} className="grid border-b border-line py-6 md:grid-cols-[56px_220px_1fr] gap-4">
                        <span style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#4b4a47" }} className="uppercase">{num}</span>
                        <p className="font-title text-xs font-bold uppercase tracking-[0.12em] text-ink self-start">{title}</p>
                        <p className="text-sm leading-7 text-graphite">{body}</p>
                      </div>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </div>
      </section>
    </>
  );
}
