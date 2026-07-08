import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { CustomCursor } from "@/components/ui/CustomCursor";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-sans",
  display: "swap",
});

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
    <html lang="en" className={sourceSans3.variable}>
      <body className="cursor-none">
        <CustomCursor />
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
