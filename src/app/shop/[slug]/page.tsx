import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckoutButton } from "@/components/forms/CheckoutButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { getProductBySlug } from "@/lib/data/loaders";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.title ?? "Shop"
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isEnquiryOnly =
    product.productType === "commission_enquiry" ||
    product.productType === "archive_only";
  const soldOut = product.stockQuantity === 0;
  const isOriginal = product.productType === "original";

  const primaryLabel = isOriginal
    ? "Collect this work"
    : product.productType === "physical_print"
      ? "Purchase print"
      : product.productType === "digital_download"
        ? "Purchase digital edition"
        : "Purchase";

  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <StatusLabel>{productTypeLabel(product.productType)}</StatusLabel>

          <h1 className="mt-5 font-serif text-5xl font-light leading-tight">
            {product.title}
          </h1>

          <p className="mt-5 text-sm leading-8 text-graphite">{product.description}</p>

          <div className="mt-8 border-y border-line py-6">
            <p className="font-serif text-3xl font-light">
              {product.priceGbp ? `GBP ${product.priceGbp}` : "Enquire for price"}
            </p>

            {soldOut && isOriginal && (
              <p className="mt-3 text-sm font-medium text-rust">This work has been sold.</p>
            )}

            <p className="mt-4 text-xs leading-6 text-graphite">
              Ships from the UK. International buyers are responsible for customs
              duties, import taxes, tariffs, and local handling fees charged by
              their country.
            </p>

            {isOriginal && (
              <p className="mt-3 text-xs leading-6 text-graphite">
                Original artworks are 1 of 1. Once purchased, the original is
                marked sold and remains visible in the archive.
              </p>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {isEnquiryOnly ? (
              <ButtonLink href="/commissions">Send enquiry</ButtonLink>
            ) : (
              <CheckoutButton
                productId={product.id}
                disabled={soldOut}
                label={soldOut ? "Sold" : primaryLabel}
              />
            )}
            <ButtonLink href="/shipping-returns" variant="quiet">
              Shipping information
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function productTypeLabel(type: string) {
  const labels: Record<string, string> = {
    original: "Original artwork",
    physical_print: "Physical print",
    print_club_subscription: "Print Club",
    digital_download: "Digital edition",
    commission_enquiry: "Commission",
    archive_only: "Archive"
  };

  return labels[type] ?? "Product";
}
