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
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-ink/0 transition-all duration-500 group-hover:bg-ink/20" />

          {soldOut && (
            <div className="absolute top-3 right-3">
              <span className="label bg-ink px-2 py-1 text-chalk">Sold Out</span>
            </div>
          )}

          {/* Hover price reveal */}
          <div className="absolute inset-x-0 bottom-0 translate-y-1.5 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="label text-chalk/90">
              {product.priceGbp ? `£${product.priceGbp}` : "Enquire"}
            </p>
          </div>
        </div>

        <div className="mt-3.5">
          <h3 className="font-title text-sm leading-snug">{product.title}</h3>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="label text-graphite">{productTypeLabel(product.productType)}</p>
            <p className="label text-ink">
              {product.priceGbp ? `£${product.priceGbp}` : "Enquire"}
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
