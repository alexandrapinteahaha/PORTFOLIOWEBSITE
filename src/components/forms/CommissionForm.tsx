"use client";

import { useActionState } from "react";
import { submitCommissionEnquiry } from "@/app/actions/commission";

export function CommissionForm() {
  const [state, formAction, pending] = useActionState(submitCommissionEnquiry, {
    ok: false,
    message: ""
  });

  return (
    <form action={formAction} className="grid gap-4 border border-line bg-chalk p-5">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone number" name="phone" />
        <Field label="Type of commission" name="commissionType" required />
        <Field label="Budget range" name="budgetRange" required />
        <Field label="Timeframe" name="timeframe" required />
      </div>
      <label className="grid gap-2 text-sm">
        Message and details
        <textarea
          name="message"
          required
          minLength={20}
          rows={7}
          className="focus-ring border border-line bg-paper p-3"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk disabled:opacity-60 md:w-fit"
      >
        {pending ? "Sending" : "Send enquiry"}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-sm text-moss" : "text-sm text-rust"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="focus-ring min-h-11 border border-line bg-paper px-3"
      />
    </label>
  );
}
