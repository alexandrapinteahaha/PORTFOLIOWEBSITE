import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stockQuantity === 0;

  return (
    <article className="group">
      <Link href={`/shop/${product.slug}`} className="focus-ring block">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
          {soldOut && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-ink px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-chalk">
                Sold
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 grid gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-2xl font-medium leading-tight">
              {product.title}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.1em] text-graphite">
              {productTypeLabel(product.productType)}
            </p>
            <p className="text-sm font-medium">
              {product.priceGbp ? `GBP ${product.priceGbp}` : "Enquire"}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

function productTypeLabel(type: Product["productType"]) {
  const labels: Record<Product["productType"], string> = {
    original: "Original work",
    physical_print: "Physical print",
    print_club_subscription: "Subscription",
    digital_download: "Digital edition",
    commission_enquiry: "Commission",
    archive_only: "Archive"
  };

  return labels[type];
}
