import type { Metadata } from "next";
import { AuthForm } from "@/app/admin/login/AuthForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  return (
    <section className="container-shell py-14">
      <SectionHeader
        title="Admin login"
        intro="Protected access for Alexandra and approved admin accounts."
      />
      <div className="mt-8">
        <AuthForm />
      </div>
    </section>
  );
}
