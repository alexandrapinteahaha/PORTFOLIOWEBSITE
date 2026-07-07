"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { saveProfileData } from "@/app/print-club/membership/actions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const inputCls =
  "focus-ring min-h-10 w-full border border-line bg-paper px-3 text-sm";
const textareaCls =
  "focus-ring w-full resize-none border border-line bg-paper px-3 py-2.5 text-sm leading-6";

export function MemberSignupForm() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    birthday_month: "",
    shipping_address: "",
    billing_address: "",
    billing_same: true,
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string | boolean) {
    setFields((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: fields.email,
        password: fields.password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        const fd = new FormData();
        fd.append("userId", data.user.id);
        fd.append("name", fields.name);
        fd.append("birthday_month", fields.birthday_month);
        fd.append("shipping_address", fields.shipping_address);
        fd.append(
          "billing_address",
          fields.billing_same ? fields.shipping_address : fields.billing_address
        );
        await saveProfileData(fd);

        if (!data.session) {
          setSuccess(true);
          return;
        }
        window.location.assign("/print-club/membership");
      }
    } catch {
      setMessage("Sign up failed — please try again or contact us.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="border border-line bg-chalk p-5 text-sm leading-7">
        <p className="font-semibold text-ink">Check your email</p>
        <p className="mt-1 text-graphite">
          We&apos;ve sent a confirmation link to <strong>{fields.email}</strong>.
          Click it to activate your account, then sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        Full name
        <input
          value={fields.name}
          onChange={(e) => set("name", e.target.value)}
          type="text"
          required
          autoComplete="name"
          className={inputCls}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        Email
        <input
          value={fields.email}
          onChange={(e) => set("email", e.target.value)}
          type="email"
          required
          autoComplete="email"
          className={inputCls}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        Password{" "}
        <span className="text-graphite font-normal">(min. 8 characters)</span>
        <input
          value={fields.password}
          onChange={(e) => set("password", e.target.value)}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputCls}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        Birthday month
        <select
          value={fields.birthday_month}
          onChange={(e) => set("birthday_month", e.target.value)}
          required
          className={inputCls}
        >
          <option value="">Select month</option>
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
          value={fields.shipping_address}
          onChange={(e) => set("shipping_address", e.target.value)}
          required
          rows={3}
          placeholder={"Street\nCity, postcode\nCountry"}
          autoComplete="shipping street-address"
          className={textareaCls}
        />
      </label>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between text-sm">
          <span>Billing address</span>
          <label className="flex cursor-pointer select-none items-center gap-1.5 text-xs text-graphite">
            <input
              type="checkbox"
              checked={fields.billing_same}
              onChange={(e) => set("billing_same", e.target.checked)}
              className="focus-ring"
            />
            Same as shipping
          </label>
        </div>
        {!fields.billing_same && (
          <textarea
            value={fields.billing_address}
            onChange={(e) => set("billing_address", e.target.value)}
            required
            rows={3}
            placeholder={"Street\nCity, postcode\nCountry"}
            autoComplete="billing street-address"
            className={textareaCls}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      {message && <p className="text-sm text-rust">{message}</p>}
    </form>
  );
}
