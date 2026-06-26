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
              <span className="label bg-ink px-2 py-1 text-chalk">Sold</span>
            </div>
          )}
        </div>
        <div className="mt-4 border-t border-dotted border-line pt-3">
          <h3 className="font-title text-base leading-snug">{product.title}</h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="label text-graphite">{productTypeLabel(product.productType)}</p>
            <p className="label text-ink">
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
