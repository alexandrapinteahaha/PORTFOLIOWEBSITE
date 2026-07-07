"use client";

import { useActionState } from "react";
import { updateMyProfile } from "./actions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const inputCls =
  "focus-ring min-h-10 w-full border border-line bg-paper px-3 text-sm";
const textareaCls =
  "focus-ring w-full resize-none border border-line bg-paper px-3 py-2.5 text-sm leading-6";

type Props = {
  initial: {
    name: string;
    birthday_month: number | null;
    shipping_address: string;
    billing_address: string;
  };
};

export function ProfileEditForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState(updateMyProfile, null);

  const shippingDefault = initial.shipping_address;
  const billingDefault =
    initial.billing_address && initial.billing_address !== initial.shipping_address
      ? initial.billing_address
      : "";

  return (
    <form action={formAction} className="grid gap-4 max-w-md">
      <label className="grid gap-1.5 text-sm">
        Full name
        <input
          name="name"
          type="text"
          defaultValue={initial.name}
          autoComplete="name"
          className={inputCls}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        Birthday month
        <select
          name="birthday_month"
          defaultValue={initial.birthday_month ?? ""}
          className={inputCls}
        >
          <option value="">Not set</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        Shipping address
        <textarea
          name="shipping_address"
          defaultValue={shippingDefault}
          rows={3}
          placeholder={"Street\nCity, postcode\nCountry"}
          autoComplete="shipping street-address"
          className={textareaCls}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        Billing address{" "}
        <span className="text-graphite font-normal">(leave blank to use shipping)</span>
        <textarea
          name="billing_address"
          defaultValue={billingDefault}
          rows={3}
          placeholder={"Street\nCity, postcode\nCountry"}
          autoComplete="billing street-address"
          className={textareaCls}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="focus-ring min-h-10 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>

      {state?.error && <p className="text-sm text-rust">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-moss">Details updated successfully.</p>
      )}
    </form>
  );
}
