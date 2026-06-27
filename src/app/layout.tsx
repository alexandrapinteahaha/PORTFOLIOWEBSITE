import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/ui/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Alexandra Pintea",
    template: "%s | Alexandra Pintea"
  },
  description:
    "Portfolio, archive, shop, and Print Club for contemporary artist Alexandra Pintea."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
