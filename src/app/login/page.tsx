import type { Metadata } from "next";
import { AuthForm } from "@/app/admin/login/AuthForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <section className="container-shell py-14">
      <SectionHeader
        title="Account login"
        intro="Sign in to access Print Club subscriber files and account details."
      />
      <div className="mt-8">
        <AuthForm />
      </div>
    </section>
  );
}
