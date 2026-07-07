"use client";

import { useState } from "react";
import { MemberLoginForm } from "./MemberLoginForm";
import { MemberSignupForm } from "./MemberSignupForm";

type Tab = "signin" | "register";

export function MemberAuthPanel() {
  const [tab, setTab] = useState<Tab>("signin");

  function tabCls(active: boolean) {
    return [
      "flex-1 py-2.5 font-title text-[11px] uppercase tracking-[0.15em] transition-colors border-b-2",
      active
        ? "border-ink text-ink"
        : "border-transparent text-graphite hover:text-ink",
    ].join(" ");
  }

  return (
    <div>
      <div className="flex mb-6 border-b border-line">
        <button type="button" className={tabCls(tab === "signin")} onClick={() => setTab("signin")}>
          Sign in
        </button>
        <button type="button" className={tabCls(tab === "register")} onClick={() => setTab("register")}>
          Create account
        </button>
      </div>
      {tab === "signin" ? <MemberLoginForm /> : <MemberSignupForm />}
    </div>
  );
}
